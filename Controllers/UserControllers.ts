import { NextFunction, Request, Response } from "express";
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto';


const getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const userId: string = req.body.user.id;
  
    try {
      const data: UserProfileResponseDto =
        await UserRetrieveService.getUserAtHome(userId);
  
      return res
        .send(data);
    } catch (error) {
      next(error);
    }
  };