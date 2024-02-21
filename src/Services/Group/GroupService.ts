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

// 그룹 아이디, 그룹 이름 받아오기
const getIdandName = async( userId:string ) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    const group = await GroupServiceUtils.findGroupById(user.groupId)

    const data = {
      groupId : user.groupId,
      groupName : group.groupName
    }

    return data

  } catch (error) {
    console.error('error :: group/GroupService/getIdandName', error)
    throw error
  }
}



// 방장이 자신의 그룹 생성 후 자신 그룹 참여
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

    for(let index = 1; index<5; index++){
      await prisma.subCategory.create({
        data: {
          groupId: groupId,
          name: "기타",
          categoryId: index
        }
      })
    }

    const GroupReturn = await UserServiceUtils.addUserToGroup(userId, createdGroup.id)
    await UserServiceUtils.addUserNotiToGroup(user.id, groupId)

    return createdGroup

    //return createdGroup;
  } catch (error) {
    console.error('Error at creating Group: group service', error)
    throw new Error('Error at creating Group: group service')
  }
}

// 참여자들이 자기 그룹 찾아들어가기
const goGroup = async (userId: string, groupId: string) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)

    const GroupReturn = await UserServiceUtils.addUserToGroup(user.id, groupId)
    await UserServiceUtils.addUserNotiToGroup(user.id, groupId)

    return GroupReturn
  } catch (error) {
    console.error('Error at entering Group: group service', error)
  }
}

// 그룹 나가기
const leaveGroup = async (userId: string) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    const group = await GroupServiceUtils.findGroupById(user.groupId)

    // user가 나가는지 groupOwner가 나가는지
    const event = prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        groupId: 'aaaaaa', // 또는 원하는 값으로 갱신
      },
    })

    const data = {
      userId: (await event).id,
      groupId: (await event).groupId,
    }
    return data
  } catch (error) {
    console.error('error :: service/group/leaveGroup', error)
  }
}

// 그룹 이름 수정
const updateGroupName = async (userId: string, groupName: string) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    const group = await GroupServiceUtils.findGroupById(user.groupId)

    const event = await prisma.group.update({
      where: {
        id: group.id,
      },
      data: {
        groupName: groupName,
      },
    })

    const data = {
      groupId: event.id,
      groupName: event.groupName,
    }

    return data
  } catch (error) {
    console.error('error :: service/group/updateGroupName', error)
  }
}

// 그룹 탈퇴
const outGroup = async (userId: string) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    const group = await GroupServiceUtils.findGroupById(user.groupId)

    const event = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        id: 'aaaaaa',
      },
    })
  } catch (error) {
    console.error('error :: service/group/outGroup', error)
  }
}





export { createGroup, getIdandName, goGroup, leaveGroup, updateGroupName, outGroup }
