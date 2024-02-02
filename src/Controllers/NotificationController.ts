import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import * as NotificationService from '../Services/NotificationService'

const getNoti = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const userId: string = req.params.userId
  
    try {
      const data = await NotificationService.getNotification(userId)
      console.log(data)
  
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

export { getNoti }