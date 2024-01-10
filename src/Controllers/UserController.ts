import { NextFunction, Request, Response } from "express";
import { validationResult, Result, ValidationError } from 'express-validator';
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto';
import { SignupDto } from "../DTOs/Auth/Requests/SignupDto";
import * as UserService from '../Services/UserService';
import statusCode from "../modules/statusCode";
import message from "../modules/message";
import util from "../modules/util";




// POST
const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  const signupDto: SignupDto = req.body
  

  try {
    const data = await UserService.createUser(signupDto)
    console.log(data)
    res.status(201).send(data)
  } catch (error) {
    console.error('Error creating user: controller', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}



// GET
const getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const userId = req.params.userId;
  
    try {
      const data = await UserService.getUserProfile(userId);
      return res.status(200).send(data);

    } catch (error) {
        res.status(500).json({ error: 'Error Fetching user profile: Controller' })
    }
  };

  export{
    createUser,
    getUserProfile
  }