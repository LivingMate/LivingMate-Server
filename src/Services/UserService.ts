import { PrismaClient } from '@prisma/client'
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto'
import { UserUpdateRequestDto } from '../DTOs/User/Request/UserUpdateRequestDto'
import { UserUpdateResponseDto } from '../DTOs/User/Response/UserUpdateResponseDto'
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto'
import * as GroupService from './Group/GroupService'
import * as GroupServiceUtils from './Group/GroupServiceUtils'
import message from '../modules/message'
import { sign } from 'crypto'

const prisma = new PrismaClient()

const createUser = async (signupDtO: SignupDto) => {
  const Id = await createUserId();
  const user = await prisma.user.create({
    data: {
      id: Id,
      userName: signupDtO.userName,
      groupId: 'aaaaaa', //default
      userColor: 'FFFFFF', //default, just temporary value for now
      email: signupDtO.email,
      sex: signupDtO.sex,
      age: signupDtO.age,
    },
  })
  const createdUser = await updateUserColor(user.id);
  //if 이미 존재하는 유저인지 확인
  return createdUser
}

const getUserProfile = async (userId: string) => {
  try {
    const userProfile = await findUserById(userId)
    if (!userProfile) {
      throw new Error('User Not Found!')
    }

    if (userProfile.groupId === null || userProfile.groupId === undefined) {
      throw new Error('User has no group!')
    }

    const groupName = await GroupServiceUtils.findGroupByGroupId(userProfile.groupId)

    const userGroupMembersNamesColors = await GroupServiceUtils.findGroupMembersNamesColorsByGroupId(userProfile.groupId);
 
    const data = {
      userName: userProfile.userName,
      userColor: userProfile.userColor,
      groupName: groupName,
      membernamesandcolors: userGroupMembersNamesColors
    }

    return data;
  } catch (error) {
    throw new Error('Error: getUserProfile:service');
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

  return user;
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

const createColor = async()=>{
  const color = Math.floor(Math.random() * 16777215).toString(16);
   return '#'+ color;
}

const updateUserColor = async(userId:string) =>{
  const color = await createColor();
  const userWithColor = await prisma.user.update({
    where:{
      id : userId
    },
    data:{
      userColor: color
    }
  })
  return userWithColor;
}

const createUserId = async()=>{
  
    const size: number = 8;
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength: number = characters.length;
    let result: string = '';
    do {
      result = '';
      for (let i: number = 0; i < size; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    } while (await duplicateId(result));
  
    return result;
 
}

const duplicateId = async(id:string)=>{
  const user = await prisma.user.findUnique({
    where:{
      id : id
    }
  });
  if (!user) return false;
  else return true;

}


export {
  createUser,
  findUserById,
  findUserByIdAndUpdate,
  getUserProfile,
  // addUserToGroup,
  getUserNameByUserId,
  getUserIdbyName,
  findUserColorByUserId,
  updateUserColor,
  createUserId,
  addUserToGroup,
  duplicateId
}
