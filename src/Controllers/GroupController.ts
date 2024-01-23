import { NextFunction, Request, Response } from 'express'
import * as GroupService from '../Services/Group/GroupService'
import statusCode from '../modules/statusCode'
import message from '../modules/message'
import util from '../modules/util'
import { GroupResponseDto } from '../DTOs/Group/Responses/GroupResponseDto'
import { GroupJoinResponseDto } from '../DTOs/Group/Responses/GroupJoinResponseDto'

const getGroup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId: string = req.body.user._id

  try {
    // Assuming you have a method in GroupService for retrieving groups
    const group = await GroupService.getGroup(userId)

    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.READ_GROUP_SUCCESS, group))
  } catch (error) {
    next(error)
  }
}

const createGroup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.params.userId
  const groupName = req.body.groupName

  try {
    const data = await GroupService.createGroup(userId, groupName)
    console.log(data)
    return res.send(data)

  } catch (error) {
    console.error('Error at creating Group: Controller', error);
    res.status(500).json({ error: 'Error creating Group: Controller' });
  }  
}

// const joinGroup

// const leaveGroup

export{
  createGroup
}