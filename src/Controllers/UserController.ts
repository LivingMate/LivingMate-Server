// import { NextFunction, Request, Response } from "express";
// import { validationResult, Result, ValidationError } from 'express-validator';
// import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto';
// import { SignupDto } from "../DTOs/Auth/Requests/SignupDto";
// import * as UserService from '../Services/UserService';
// import statusCode from "../modules/statusCode";
// import message from "../modules/message";
// import util from "../modules/util";




// // POST
// const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
//   const errors: Result<ValidationError> = validationResult(req)
//   if (!errors.isEmpty()) {
//     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
//   }

//   const { userId } = req.params
//   const signupDto: SignupDto = req.body
//   const { groupId } = req.params

//   try {
//     const data = await UserService.createUser(userId, groupId, calendarCreateDto)
//     console.log(data)
//     res.status(201).json(data)
//   } catch (error) {
//     console.error('Error creating calendar event', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// }



// // GET
// const getUserProfile = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void | Response> => {
//     const userId: string = req.body.user.id;
  
//     try {
//       const data: UserProfileResponseDto =
//         await UserService.getUserProfile(userId);
  
//       return res
//         .send(data);
//     } catch (error) {
//       next(error);
//     }
//   };

//   export{
//     getUserProfile
//   }