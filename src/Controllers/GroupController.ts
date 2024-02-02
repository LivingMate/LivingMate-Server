import { NextFunction, Request, Response } from 'express'
import * as GroupService from '../Services/Group/GroupService'
import statusCode from '../modules/statusCode'
import message from '../modules/message'
import util from '../modules/util'
import { GroupResponseDto } from '../DTOs/Group/Responses/GroupResponseDto'
import { GroupJoinResponseDto } from '../DTOs/Group/Responses/GroupJoinResponseDto'

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

const goGroup = async (req: Request, res: Response, next: NextFunction) =>{
  const userId = req.params.userId
  const groupId = req.body.groupId

  try{
    const data = await GroupService.goGroup(userId, groupId)
    console.log(data)
    return res.send(data)
  } catch (error) {
    console.error('Error at entering Group: Controller', error);
    res.status(500).json({ error: 'Error creating Group: Controller' });
  }  
}

const updateGroupName = async (req: Request, res: Response, next: NextFunction) =>{
  const userId = req.params.userId
  const groupName = req.body.groupName

  try{
    const data = await GroupService.updateGroupName(userId, groupName)
    console.log(data)
    return res.send(data)
  } catch (error) {
    console.error('Error at entering Group: Controller', error);
    res.status(500).json({ error: 'Error creating Group: Controller' });
  }  
}

// const joinGroup

// const leaveGroup
const leaveGroup = async (req: Request, res: Response, next: NextFunction) =>{
  const userId = req.params.userId

  try{
    const data = await GroupService.leaveGroup(userId)
    console.log(data)
    return res.send(data)
  } catch (error) {
    console.error('Error at leaving Group: Controller', error);
    res.status(500).json({ error: 'Error leaving Group: Controller' });
  }  
}

export{
  createGroup,
  goGroup,
  updateGroupName,
  leaveGroup
}