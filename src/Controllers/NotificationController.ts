import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import * as NotificationService from '../Services/NotificationService'
import statusCode from '../modules/statusCode'
import message from '../modules/message'
import util from '../modules/util'

const getNoti = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.body.user.id;
  
    try {
      const data = await NotificationService.getNotification(userId)
      console.log(data)
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, message.GET_NOTIFICATION_SUCCESS, data))
    } catch (error) {
      next(error)
    }
  }

export { getNoti }