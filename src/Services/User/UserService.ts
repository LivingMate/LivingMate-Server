import { PrismaClient } from '@prisma/client'
import { SignupDto } from '../../DTOs/Auth/Requests/SignupDto'
import { UserUpdateRequestDto } from '../../DTOs/User/Request/UserUpdateRequestDto'
import { UserUpdateResponseDto } from '../../DTOs/User/Response/UserUpdateResponseDto'
import { UserProfileResponseDto } from '../../DTOs/User/Response/UserProfileResponseDto'
import * as UserServiceUtils from './UserServiceUtils'
import * as GroupService from '../Group/GroupService'
import * as GroupServiceUtils from '../Group/GroupServiceUtils'
import * as NotificationService from '../NotificationService'
import message from '../../modules/message'
import { sign } from 'crypto'

const prisma = new PrismaClient()

// 신규 유저 생성 & 알림 상태 생성
const createUser = async (signupDtO: SignupDto) => {
  const Id = await UserServiceUtils.createUserId()
  const user = await prisma.user.create({
    data: {
      id: Id,
      userName: signupDtO.userName,
      groupId: signupDtO.groupId || 'aaaaaa', //default
      userColor: 'FFFFFF', //default, just temporary value for now
      email: signupDtO.email,
      sex: signupDtO.sex,
      age: signupDtO.age,
    },
  })

  const userNoti = await prisma.userNoti.create({
    data: {
      userId: user.id,
      groupId: user.groupId,
      state: true
    }
  })

  const data = {
      userId: user.id,
      userName: user.userName,
      userColor: user.userColor,
      groupId: user.groupId,
      email: user.email,
      sex: user.sex,
      age: user.age,
      notificationState: userNoti.state
    }

  return data
}

// 마이페이지 유저 정보 반환
const getUserProfile = async (userId: string) => {
  try {
    const userProfile = await UserServiceUtils.findUserById(userId)
    if (!userProfile) {
      throw new Error('User Not Found!')
    }

    if (userProfile.groupId === null || userProfile.groupId === undefined) {
      throw new Error('User has no group!')
    }

    const groupName = await GroupServiceUtils.findGroupByGroupId(userProfile.groupId)

    const userGroupMembersNamesColors = await GroupServiceUtils.findGroupMembersNamesColorsByGroupId(
      userProfile.groupId,
    )

    const data = {
      userName: userProfile.userName,
      userColor: userProfile.userColor,
      groupName: groupName,
      membernamesandcolors: userGroupMembersNamesColors,
    }

    return data
  } catch (error) {
    throw new Error('Error: getUserProfile:service')
  }
}

// 유저 정보 수정(이름&색상)
const userSetUpdate = async (userId: string, userUpdateRequestDto: UserUpdateRequestDto) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      userName: userUpdateRequestDto.userName,
      userColor: userUpdateRequestDto.userColor,
    },
  })

  const data = {
    userName: updatedUser.userName,
    userColor: updatedUser.userColor,
  }

  return data
}

// 유저 정보 조회(이름&색상)
const userSetGet = async (userId:string) => {

  const user = await UserServiceUtils.findUserById(userId)
  if (!user) {
    throw new Error('User Not Found!')
  }

  const data = {
    userName: user.userName,
    userColor: user.userColor,
  }

  return data
}

// 유저 알림 설정 여부(on off)
const notiYesNo = async (userId: string, notificationState:boolean) => {
  try {
    const notiState = await prisma.userNoti.update({
      where: {
        userId: userId,
      },
      data: {
        state: notificationState,
      },
    })

    const data = {
      notificationState : notiState.state
    }
  
    return data
  } catch (error) {
    throw new Error('Error: service/user/notiYesNo')
  }
}

// 유저 알림 상태 가져오기 (on off)
const getUserNotiState = async(userId:string) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    const userNotiId = UserServiceUtils.findUserNotiIdbyUserId(user.id)

    if (!user) {
      throw new Error('User Not Found!')
    }

    const data = {
      notiState : (await userNotiId).state
    }

    return data
  } catch (error) {
    throw new Error('Error: service/user/getUserNotiState')
  }
}


export {
  createUser,
  getUserProfile,
  userSetUpdate,
  userSetGet,
  notiYesNo,
  getUserNotiState
}
