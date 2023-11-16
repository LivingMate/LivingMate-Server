import { UserBaseDTO } from "../DTOs/User/UserBaseDTO";
import { SignupDto } from "../DTOs/Auth/Requests/SignupDto";
import { UserUpdateDto } from "../DTOs/User/Request/UserUpdateRequestDto";
import { UserUpdateResponseDto } from "../DTOs/User/Response/UserUpdateResponseDto";



const createUser = async(signupDtO : SignupDto):Promise<PostBaseResponseDto> =>{
    //if 이미 존재하는 유저인지 확인
    const user = new User({
        userName: signupDtO.userName,
        fcmToken: signupDtO.fcmToken,
        //이어서
    });


}

const updateUser = async(
    userId: string, userUpdateDto:UserUpdateDto):Promise<UserUpdateResponseDto> =>{


    }

//https://github.com/TeamHous/Hous-Server/blob/develop/src/services/user/UserService.ts