import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { SignupDto } from '../../DTOs/Auth/Requests/SignupDto'
import { UserUpdateRequestDto } from '../../DTOs/User/Request/UserUpdateRequestDto'
import { UserUpdateResponseDto } from '../../DTOs/User/Response/UserUpdateResponseDto'
import { UserProfileResponseDto } from '../../DTOs/User/Response/UserProfileResponseDto'
import * as GroupService from '../Group/GroupService'
import * as GroupServiceUtils from '../Group/GroupServiceUtils'
import * as NotificationService from '../NotificationService'
import message from '../../modules/message'
import { sign } from 'crypto'

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

const updateUserColor = async (userId: string) => {
    const color = await createColor()
    const userWithColor = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userColor: color,
      },
    })
    return userWithColor
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

// userName으로 userID 찾기
const getUserIdbyName = async (userName: string[]) => {
  // userId가 정의되어 있지 않거나 문자열이 아닌 경우 에러 발생
  if (!userName || typeof userName !== 'string') {
    throw new Error('Invalid userName')
  }

  const data = await prisma.user.findUnique({
    where: {
      userName: userName,
    },
  })
  if (!data) {
    throw new Error(message.UNAUTHORIZED)
  }
  return data.id
}

//+ 그룹 참여하는 서비스
const addUserToGroup = async (userId: string, groupId: string) => {
  //1. createUser with signupDTO
  //2. put her groupId in her record at User table
  //3. assign her id(? not sure) to Group's User[]? Did it mean it had foreign relations with the table?

  const data = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      groupId: groupId,
    },
  })
  await NotificationService.makeNotification(groupId, userId, 'newUser')
  return data
}

const createColor = async () => {
  const color = Math.floor(Math.random() * 16777215).toString(16)
  return '#' + color
}

const duplicateId = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })
  if (!user) return false
  else return true
}

const createUserId = async () => {
  const size: number = 8
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength: number = characters.length
  let result: string = ''
  do {
    result = ''
    for (let i: number = 0; i < size; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
  } while (await duplicateId(result))

  return result
}

export {
  findUserById,
  getUserNameByUserId,
  updateUserColor,
  findUserColorByUserId,
  getUserIdbyName,
  addUserToGroup,
  createColor,
  duplicateId,
  createUserId,
}
