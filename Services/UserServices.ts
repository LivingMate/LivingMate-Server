import {PrismaClient} from '@prisma/client';
import { UserBaseDTO } from "../DTOs/User/UserBaseDTO";
import { SignupDto } from "../DTOs/Auth/Requests/SignupDto";
import { UserUpdateRequestDto } from "../DTOs/User/Request/UserUpdateRequestDto";
import { UserUpdateResponseDto } from "../DTOs/User/Response/UserUpdateResponseDto";
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto';
import { findGroupNameByGroupId } from './GroupServices';
import { group } from 'console';

const prisma = new PrismaClient;


const CreateUser = async(signupDtO : SignupDto):Promise<UserProfileResponseDto> =>{
    const user = await prisma.user.create({
        data:{ 
            userName: signupDtO.userName,
            sex: signupDtO.sex,
            age: signupDtO.age,

        },
        

    })
    //if 이미 존재하는 유저인지 확인
    return user;
};





const getUserProfile = async (userId: string): Promise<UserProfileResponseDto> => {
    try {
      const userProfile = await findUserById(userId);
  
      if (!userProfile) {
        throw new Error('User Not Found!');
      }
      
      const userGroupName = await findGroupNameByGroupId(userProfile.groupId)
  
      const data: UserProfileResponseDto = {
        userName: userProfile.userName,
        userColor: userProfile.userColor,
        groupName: userGroupName.groupName, 
        // groupMembers: 
        
      };
  
      return data;
    } catch (error) {
      throw error;
    }
  };



const findUserById = async(userId:string)=>{
    const user = await prisma.user.findUnique({
        where:{
            id: userId,
        }
    });

    if(!user){
        throw new Error ('User not found!') //임시
    }

    return user;
};



const findGroupIdByUserId = async(userId:string)=>{
    const group = prisma.user.findUnique({
        where:{
            id: userId,
        },
        select:{
            groupId: true,
        },
    });
    if(!group){
        throw new Error ('Group not found!');
    }
   return group;
};

const findUserByIdAndUpdate = async (userId:string, userUpdateRequestDto:UserUpdateRequestDto) =>{
    const updatedUser = await prisma.user.update({
        where:{
            id: userId,
        },
        data:{
            userName: userUpdateRequestDto.userName,
            userColor: userUpdateRequestDto.userColor,
        },
    });

    return updatedUser;
};

//+ 그룹 참여하는 서비스도 만들어야 함. 





export default{
    findUserById,
    findGroupIdByUserId,
    findUserByIdAndUpdate,
    getUserProfile
}
