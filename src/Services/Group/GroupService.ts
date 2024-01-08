import { Group, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { SignupDto } from '../../DTOs/Auth/Requests/SignupDto'
import { GroupResponseDto } from '../../DTOs/Group/Responses/GroupResponseDto'
import * as UserService from '../UserService'
import { group } from 'console'
import * as GroupServiceUtils from './GroupServiceUtils'


// createGroup
const createGroup = async (userId: string): Promise<GroupResponseDto> => {
  try {
    const user = await UserService.findUserById(userId)

    await GroupServiceUtils.checkJoinedGroupId(user?.groupId || '')

    const createdGroup = await prisma.group.create({
      data: {
        groupOwner: userId,
        groupCode: user.groupId,
        groupName: '',
        groupSpending: 0,
      },
    })

    const data: GroupResponseDto = {
      _id: createdGroup.id,
      groupCode: createdGroup.groupCode,
    }
    return data
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
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

export {
  createGroup,
  leaveGroup,
  getGroup,
}
