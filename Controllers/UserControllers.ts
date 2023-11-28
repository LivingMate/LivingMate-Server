import { NextFunction, Request, Response } from "express";
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto';
import {UserService} from '../Services/index';

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