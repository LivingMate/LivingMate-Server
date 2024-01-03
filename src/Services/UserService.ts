import { PrismaClient } from '@prisma/client'
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto'
import { UserUpdateRequestDto } from '../DTOs/User/Request/UserUpdateRequestDto'
import { UserUpdateResponseDto } from '../DTOs/User/Response/UserUpdateResponseDto'
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto'
import * as GroupService from './GroupService'

const prisma = new PrismaClient()

const createUser = async (signupDtO: SignupDto) => {
  const user = await prisma.user.create({
    data: {
      userName: signupDtO.userName,
      userColor: 'FFFFFF', //default, just temporary value for now
      email: signupDtO.email,
      sex: signupDtO.sex,
      age: signupDtO.age,
    },
  })
  //if 이미 존재하는 유저인지 확인
  return user
}

const getUserProfile = async (userId: string): Promise<UserProfileResponseDto> => {
  try {
    const userProfile = await findUserById(userId)
    if (!userProfile) {
      throw new Error('User Not Found!')
    }

    if (userProfile.groupId === null || userProfile.groupId === undefined) {
      throw new Error('User has no group!')
    }
    const userGroupName = await GroupService.findGroupNameByGroupId(userProfile.groupId)
    const groupName = userGroupName?.groupName ?? 'DefaultGroupName'

    const userGroupMembersNames = await GroupService.findGroupMembersNamesByGroupId(userProfile.groupId)
    const groupMembersNames = userGroupMembersNames ?? []

    const userGroupMembersColors = await GroupService.findGroupMembersColorsByGroupId(userProfile.groupId)
    const groupMembersColors = userGroupMembersColors ?? []

    const data: UserProfileResponseDto = {
      userName: userProfile.userName,
      userColor: userProfile.userColor,
      groupName,
      groupMembersNames,
      groupMembersColors,
    }

    return data
  } catch (error) {
    throw error
  }
}

const findUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error('User not found!') //임시
  }

  return user
}

const findGroupIdByUserId = async (userId: string) => {
  const group = prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      groupId: true,
    },
  })
  if (!group) {
    throw new Error('Group not found!')
  }
  return group
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

//유저 아이디로 유저 이름 찾기
async function getUserNameByUserId(userId: string) {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (result) {
      return result.userName
    } else {
      return 'error'
    }
  } catch (error) {
    console.error('Error in getUserNameByUserId:', error)
    throw error
  }
}

// userId로 userColor 찾기
const findUserColorByUserId = async (userId: string) => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (data) {
      return data.userColor
    } else {
      return 'error'
    }
  } catch (error) {
    console.error('error :: service/budget/findUserColorByUserId', error)
    throw error
  }
}

//+ 그룹 참여하는 서비스
const addUserToGroup = async (signupDTO: SignupDto, groupId: string) => {
  //1. createUser with signupDTO
  //2. put her groupId in her record at User table
  //3. assign her id(? not sure) to Group's User[]? Did it mean it had foreign relations with the table?
  const newUser = await createUser(signupDTO)
  await prisma.user.update({
    where: {
      id: newUser.id,
    },
    data: {
      groupId: groupId,
    },
  })
  return newUser
}

export {
  createUser,
  findUserById,
  findGroupIdByUserId,
  findUserByIdAndUpdate,
  getUserProfile,
  addUserToGroup,
  getUserNameByUserId,
  findUserColorByUserId,
}
