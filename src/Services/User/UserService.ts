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
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// 신규 유저 생성 & 알림 상태 생성
const createUser = async (signupDtO: SignupDto) => {
  const Id = await UserServiceUtils.createUserId()
  const userC = await UserServiceUtils.createColor()
  const defaultGroupId = 'aaaaaa';
  
  const salt: string = await bcrypt.genSalt(10);
  const userpassword = await bcrypt.hash(signupDtO.password, salt);


  const user = await prisma.user.create({
    data: {
      id: Id,
      userName: signupDtO.userName,
      groupId: defaultGroupId, //default
      userColor: userC,
      email: signupDtO.email,
      sex: signupDtO.sex,
      birth: signupDtO.birth,
      password: userpassword
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
      birth: user.birth,
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

    const userGroupMembers = await GroupServiceUtils.findGroupMembersNamesColorsByGroupId(userProfile.groupId);

    const userGroupMembersNamesColors = userGroupMembers
      .filter(member => member.id !== userId) // 자신의 정보 제외
      .map(member => ({
        userId: member.id,
        userName: member.userName,
        userColor: member.userColor,
      }));

    const data = {
      userId: userId,
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

// 그룹유저 정보 반환(본인 포함)
const getAllMember = async (userId:string) => {
  try {
    const userProfile = await UserServiceUtils.findUserById(userId)
    if (!userProfile) {
      throw new Error('User Not Found!')
    }

    if (userProfile.groupId === null || userProfile.groupId === undefined) {
      throw new Error('User has no group!')
    }

    const userGroupMembers = await GroupServiceUtils.findGroupMembersNamesColorsByGroupId(userProfile.groupId)

    const userGroupMembersNamesColors = userGroupMembers
      .map(member => ({
        userId: member.id,
        userName: member.userName,
        userColor: member.userColor,
      }));
    
    const data = {
      membernamesandcolors: userGroupMembersNamesColors,
    }

    return data

  } catch (error) {
    throw new Error('Error: Service/UserService/getAllMember')
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
    userId : userId,
    userName: user.userName,
    userColor: user.userColor,
  }

  return data
}

// 유저 알림 설정 여부(on off)
const notiYesNo = async (userId: string, notificationState:boolean) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9);

    const notiState = await prisma.userNoti.update({
      where: {
        userId: userId,
      },
      data: {
        state: notificationState,
        updatedAt: currentDate,
      },
    })

    const data = {
      notificationState : notiState.state,
      updatedAt: notiState.updatedAt,
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

// 유저 탈퇴
const quitUser = async(userId : string) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    if (!user) {
      throw new Error('User not found');
    }
    const changedEmail = await UserServiceUtils.createEmail()

    const quiting = await prisma.user.updateMany({
      where:{
        id : user.id
      },
      data : {
        userName : '알수없음',
        userColor : '#ffffff',
        email: changedEmail + '@LivingMate.com',
        groupId: user.groupId,
        birth: '0000-00-00',
        sex: 'none'
      }
    });

    return '탈퇴'

  } catch (error) {
    console.error('Error: service/user/quitUser', error);
    throw new Error('Error: service/user/quitUser');
  }
}

export {
  createUser,
  getUserProfile,
  getAllMember,
  userSetUpdate,
  userSetGet,
  notiYesNo,
  getUserNotiState,
  quitUser
}
