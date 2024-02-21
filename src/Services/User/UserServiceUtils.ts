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
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found!');
    }

    return user;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};


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
    console.error('error :: service/userUtils/findUserColorByUserId', error)
    throw error
  }
}


//+ 그룹 참여하는 서비스
const addUserToGroup = async (userId: string, groupId: string) => {

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      groupId: groupId,
    },
  })
  
  await NotificationService.makeNotification(groupId, userId, 'newUser')
  
  //return data
}

// userNoti groupId도 바꿔주기
const addUserNotiToGroup = async (userId: string, groupId: string) => {
  
  await prisma.userNoti.update({
    where: {
      userId: userId,
    },
    data: {
      groupId: groupId,
    },
  })
  
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

const createEmail = async () => {
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

const findUserNotiIdbyUserId = async (userId:string) => {
  try {
    const data = await prisma.userNoti.findUnique({
      where: {
        userId: userId
      },
    })
    if (!data) {
      throw new Error(message.UNAUTHORIZED)
    }

    return data
  } catch (error) {
    console.error('error :: service/userUtils/findUserNotiIdbyUserId', error)
    throw error
  }
}

const findGroupOwner = async(groupId:string) => {
  try {
    const data = await prisma.group.findUnique({
      where: {
        id: groupId
      },
    })
    if (!data) {
      throw new Error(message.UNAUTHORIZED)
    }

    return data.groupOwner
  } catch (error) {
    console.error('error :: service/userUtils/findGroupOwner', error)
    throw error
  }
}



export {
  findUserById,
  getUserNameByUserId,
  updateUserColor,
  findUserColorByUserId,
  addUserToGroup,
  addUserNotiToGroup,
  createColor,
  duplicateId,
  createUserId,
  createEmail,
  findUserNotiIdbyUserId,
  findGroupOwner
}
