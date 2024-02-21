import { NextFunction, Request, Response } from 'express'
import * as GroupService from '../Services/Group/GroupService'
import * as GroupServiceUtils from '../Services/Group/GroupServiceUtils'
import statusCode from '../modules/statusCode'
import message from '../modules/message'
import util from '../modules/util'

const createGroup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId = req.body.user.id
  const groupName = req.body.groupName

  try {
    const data = await GroupService.createGroup(userId, groupName)
    console.log(data)

    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.CREATE_GROUP_SUCCESS))
  } catch (error) {
    console.error('Error at creating Group: Controller', error)
    res.status(500).json({ error: 'Error creating Group: Controller' })
  }
}

const goGroup = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user.id
  const groupId = req.body.groupId

  try {
    const data = await GroupService.goGroup(userId, groupId)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.JOIN_GROUP_SUCCESS))
  } catch (error) {
    console.error('Error at entering Group: Controller', error)
    res.status(500).json({ error: 'Error creating Group: Controller' })
  }
}

const updateGroupName = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user.id
  const groupName = req.body.groupName

  try {
    const data = await GroupService.updateGroupName(userId, groupName)
    console.log(data)

    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.UPDATE_GROUP_SUCCESS, data))
  } catch (error) {
    console.error('Error at entering Group: Controller', error)
    res.status(500).json({ error: 'Error creating Group: Controller' })
  }
}

// const leaveGroup
const leaveGroup = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user.id

  try {
    const data = await GroupService.leaveGroup(userId)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.LEAVE_GROUP_SUCCESS, data))
  } catch (error) {
    console.error('Error at leaving Group: Controller', error)
    res.status(500).json({ error: 'Error leaving Group: Controller' })
  }
}

// groupId get해주기 
const getGroupId = async(req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.user.id

  try {
    
    const data = await GroupService.getIdandName(userId)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.INVITATION_GROUP_SUCCESS, data))

  } catch (error) {
    console.error('Error at getting GroupId : Controller', error)
    res.status(500).json({ error: 'Error getting GroupId: Controller' })
  }
}

export { createGroup, goGroup, updateGroupName, leaveGroup, getGroupId }
