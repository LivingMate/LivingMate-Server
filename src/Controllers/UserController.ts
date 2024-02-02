import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import { UserProfileResponseDto } from '../DTOs/User/Response/UserProfileResponseDto'
import { UserUpdateRequestDto } from '../DTOs/User/Request/UserUpdateRequestDto'
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto'
import * as UserService from '../Services/User/UserService'
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

// // PATCH
// const addUserToGroup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
//   const errors: Result<ValidationError> = validationResult(req)
//   if (!errors.isEmpty()) {
//     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
//   }

//   const signupDto: SignupDto = req.body
//   const groupId = req.params.groupId

//   try {
//     const data = await UserService.addUserToGroup(signupDto, groupId)
//     console.log(data)
//     res.status(201).send(data)
//   } catch (error) {
//     console.error('Error creating userToGroup: controller', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// }


// PATCH
const userSetUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  const userId = req.params.userId
  const userUpdateRequestDto: UserUpdateRequestDto = req.body

  try {
    const data = await UserService.userSetUpdate(userId, userUpdateRequestDto)

    console.log(data)
    res.status(201).send(data)
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

  const userId = req.params.userId
  const notificationState = req.body.notificationState

  try {
    const data = await UserService.notiYesNo(userId, notificationState)

    console.log(data)
    res.status(201).send(data)
  } catch (error) {
    console.error('Error user noti changing: controller', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}


// GET
const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.params.userId
  try {
    const data = await UserService.getUserProfile(userId)
    return res.status(200).send(data)
  } catch (error) {
    res.status(500).json({ error: 'Error getting user profile: Controller' })
  }
}

const getAllMember = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.params.userId
  try {
    const data = await UserService.getAllMember(userId)
    return res.status(200).send(data)
  } catch (error) {
    res.status(500).json({ error: 'Error getting user member: Controller' })
  }
}

const getUserSet = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.params.userId
  try {
    const data = await UserService.userSetGet(userId)
    return res.status(200).send(data)
  } catch (error) {
    res.status(500).json({ error: 'Error getting user setting: Controller' })
  }
}

const getUserNotiState = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.params.userId
  try {
    const data = await UserService.getUserNotiState(userId)
    console.log(data)
    return res.status(200).send(data)
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
  getUserNotiState
  // addUserToGroup
}
