import { Group, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { SignupDto } from '../../DTOs/Auth/Requests/SignupDto'
import { GroupResponseDto } from '../../DTOs/Group/Responses/GroupResponseDto'
import * as UserService from '../User/UserService'
import * as UserServiceUtils from '../User/UserServiceUtils'
import { group } from 'console'
import * as GroupServiceUtils from './GroupServiceUtils'

//그룹아이디 생성하기
const createGroupId = async () => {
  const size: number = 8
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength: number = characters.length
  let result: string = ''
  do {
    result = ''
    for (let i: number = 0; i < size; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
  } while (await UserServiceUtils.duplicateId(result))

  return result
}

// createGroup
const createGroup = async (userId: string, groupName: string) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    const groupId = await createGroupId()

    await GroupServiceUtils.checkJoinedGroupId(user?.groupId || '')

    const createdGroup = await prisma.group.create({
      data: {
        id: groupId,
        groupOwner: userId,
        groupName: groupName,
        groupSpending: 0,
      },
    })

    const GroupReturn = await UserServiceUtils.addUserToGroup(userId, createdGroup.id)
    return GroupReturn

    //return createdGroup;
  } catch (error) {
    console.error('Error at creating Group: group service', error)
    throw new Error('Error at creating Group: group service')
  }
}

// 그룹 나가기
const leaveGroup = async (userId: string, groupId: string): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    })

    if (!group) {
      throw new Error('Group not found')
    }

    // user가 나가는지 groupOwner가 나가는지
    if (group.groupOwner === userId) {
      // groupOwner가 나가면 group 걍 사라짐
      await prisma.group.delete({
        where: {
          id: groupId,
        },
      })
    } else {
      // 일반 user가 나가면 그룹 탈퇴로 적용
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          groupId: undefined, // 또는 원하는 값으로 갱신
        },
      })
    }
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 그룹 받기
const getGroup = async (userId: string): Promise<string | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user.groupId ?? null
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export { createGroup, leaveGroup, getGroup }
