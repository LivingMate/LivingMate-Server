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
  const createdUser = await UserServiceUtils.updateUserColor(user.id)
  //if 이미 존재하는 유저인지 확인
  return createdUser
}

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

const findUserByIdAndUpdate = async (userId: string, userUpdateRequestDto: UserUpdateRequestDto) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      userName: userUpdateRequestDto.userName,
      userColor: userUpdateRequestDto.userColor,
    },
  })

  return updatedUser
}



export {
  createUser,
  findUserByIdAndUpdate,
  getUserProfile,
}
