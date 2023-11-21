import {PrismaClient} from '@prisma/client';
import { UserBaseDTO } from "../DTOs/User/UserBaseDTO";
import { SignupDto } from "../DTOs/Auth/Requests/SignupDto";
import { UserUpdateRequestDto } from "../DTOs/User/Request/UserUpdateRequestDto";
import { UserUpdateResponseDto } from "../DTOs/User/Response/UserUpdateResponseDto";

const prisma = new PrismaClient;

const user = async(signupDtO : SignupDto):Promise<PostBaseResponseDto> =>{
    //if 이미 존재하는 유저인지 확인
    const userCreate = await prisma.user.create({
        data: {
            userName: signupDtO.userName,
            fcmToken: signupDtO.fcmToken,
        }
        
    });
    return user;
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
            userId: userId,
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
            userId: userId,
        },
        select:{
            groupId: true,
        },
    });
    if(!group){
        throw(console.error());
    }
   return group;
};

const findUserByIdAndUpdate = async (userId:string, userUpdateRequestDto:UserUpdateRequestDto) =>{
    const updatedUser = await prisma.user.update({
        where:{
            userId: userId,
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
    user
}
