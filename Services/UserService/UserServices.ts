import {PrismaClient} from '@prisma/client';
import { UserBaseDTO } from "../../DTOs/User/UserBaseDTO";
import { SignupDto } from "../../DTOs/Auth/Requests/SignupDto";
import { UserUpdateRequestDto } from "../../DTOs/User/Request/UserUpdateRequestDto";
import { UserUpdateResponseDto } from "../../DTOs/User/Response/UserUpdateResponseDto";
import { UserProfileResponseDto } from '../../DTOs/User/Response/UserProfileResponseDto';
import { findGroupMembersColorsByGroupId, findGroupNameByGroupId } from '../GroupServices';
import { findGroupMembersNamesByGroupId } from '../GroupServices';

const prisma = new PrismaClient;

const CreateUser = async(signupDtO : SignupDto) =>{
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

      const userGroupName = await findGroupNameByGroupId(userProfile.groupId);
      const userGroupMembersNames = await findGroupMembersNamesByGroupId(userProfile.groupId);
      const userGroupMembersColors = await findGroupMembersColorsByGroupId(userProfile.groupId);
  
      const data: UserProfileResponseDto = {
        userName: userProfile.userName,
        userColor: userProfile.userColor,
        groupName: userGroupName.groupName,
        groupMembersNames: userGroupMembersNames,
        groupMembersColors: userGroupMembersColors

        //prisma return 값이 object라서 생기는 문제. 얘의 멤버변수를 참조하면 되는데, groupMembers는 object로 이루어진 array라서 고민됨
        //groupservice 33줄 참고
        //해결!!!!
      };
  
      return data;
    } catch (error) {
      throw error;
    }
  };



/*const updateUser = async(
    userId: string, 
    userUpdateRequestDto:UserUpdateRequestDto):Promise<UserUpdateResponseDto> =>{



    return 
    }

*/

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
