import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto'
import { UserUpdateRequestDto } from '../DTOs/User/Request/UserUpdateRequestDto'
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto'
import * as UserService from '../Services/User/UserService'
import * as GroupServiceUtils from '../Services/Group/GroupServiceUtils'
import statusCode from '../modules/statusCode'
import message from '../modules/message'
import util from '../modules/util'

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


// PATCH
const userSetUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  const userId = req.body.user.id;
  const userUpdateRequestDto: UserUpdateRequestDto = req.body

  try {
    const data = await UserService.userSetUpdate(userId, userUpdateRequestDto)

    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.UPDATE_USER_SUCCESS, data))
  
  } catch (error) {
    console.error('Error creating user: controller', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const userNotiYesNo = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  const userId = req.body.user.id;
  const notificationState = req.body.notificationState

  try {
    const data = await UserService.notiYesNo(userId, notificationState)

    console.log(data)
    res.status(201).send(util.success(statusCode.OK, message.UPDATE_USER_NOTIFICATION_STATE_SUCCESS, data))
    
  } catch (error) {
    console.error('Error user noti changing: controller', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const quitUser = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.body.user.id;
  
  try {
    const data = await UserService.quitUser(userId);
    console.log(data);
    res.status(201).send(util.success(statusCode.OK, message.DELETE_USER_SUCCESS))
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error quiting user in Controller:', error.message);
      res.status(500).json({ error: 'Error quiting user in Controller' });
    } else {
      console.error('Unknown error quiting user in Controller:', error);
      res.status(500).json({ error: 'Unknown error quiting user in Controller' });
    }
  }
};


// GET
const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.body.user.id;

  try {
    const data = await UserService.getUserProfile(userId)
    res.status(201).send(util.success(statusCode.OK, message.READ_MYPAGE_SUCCESS, data))
    
  } catch (error) {
    res.status(500).json({ error: 'Error getting user profile: Controller' })
  }
}

const getAllMember = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.body.user.id;
  
  try {
    const data = await UserService.getAllMember(userId)
    res.status(201).send(util.success(statusCode.OK, message.READ_MEMBERS_SUCCESS, data))
    
  } catch (error) {
    res.status(500).json({ error: 'Error getting user member: Controller' })
  }
}

const getUserSet = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.body.user.id;
  
  try {
    const data = await UserService.userSetGet(userId)
    res.status(201).send(util.success(statusCode.OK, message.READ_USER_SUCCESS, data))
    
  } catch (error) {
    res.status(500).json({ error: 'Error getting user setting: Controller' })
  }
}

const getUserNotiState = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.body.user.id;
  
  try {
    const data = await UserService.getUserNotiState(userId)
    console.log(data)
    res.status(201).send(util.success(statusCode.OK, message.READ_USER_NOTIFICATION_SUCCESS, data))
    
  } catch (error) {
    res.status(500).json({ error: 'Error getting user notiState: Controller' })
  }
}


export {
  createUser,
  userSetUpdate,
  userNotiYesNo,
  getUserProfile,
  getAllMember,
  getUserSet,
  getUserNotiState,
  quitUser
}
