import { NextFunction, Request, Response } from "express";
import { validationResult, Result, ValidationError } from 'express-validator';
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto';
import * as UserService from '../Services/UserService';


const getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const userId: string = req.body.user.id;
  
    try {
      const data: UserProfileResponseDto =
        await UserService.getUserProfile(userId);
  
      return res
        .send(data);
    } catch (error) {
      next(error);
    }
  };

  export{
    getUserProfile
  }