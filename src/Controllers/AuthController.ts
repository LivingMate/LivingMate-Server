import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { LoginDto } from '../DTOs/Auth/Requests/LoginDto';
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto';
import {getToken} from '../Middleware/jwtHandler';
import message from '../modules/message';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import * as AuthService from '../Services/AuthService';
import * as UserService from '../Services/User/UserService';




// POST /auth/signup

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST)
      );
  }

  const signupDto: SignupDto = req.body;
  try {
    const data = await UserService.createUser(signupDto);

    const accessToken: string = getToken(data.userId);

     return res
       .status(statusCode.CREATED)
       .send(
         util.success(statusCode.CREATED, message.SIGNUP_SUCCESS, accessToken)
       );
   } catch (error) {
     next(error);
   }
};


//login

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST)
      );
  }

   const LoginDto: LoginDto = req.body;

  try {
    const data = await AuthService.login(LoginDto);

    const accessToken: string = getToken(data.userId);
    
     return res
       .status(statusCode.OK)
       .send(util.success(statusCode.OK, message.LOGIN_SUCCESS, accessToken));
   } catch (error) {
     next(error);
   }
};

const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(
        util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST)
      );
  }

  const socialToken = req.header("accessToken")?.split(" ").reverse()[0] as string;
  const { socialPlatform } = req.body;

if (socialPlatform === null || socialPlatform === undefined) {
  return res
  .status(statusCode.BAD_REQUEST)
  .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
}

try {
  const data = await AuthService.socialLogin(socialToken, socialPlatform);

  if (data === message.NULL_VALUE) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, message.NULL_VALUE));
  }

  return res.status(statusCode.OK)
    .send(util.success(statusCode.OK, message.LOGIN_SUCCESS, data));
} catch (error) {
  
};
}


export {
  signup,
  login,
  socialLogin
};