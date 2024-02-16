import { Router, Request, Response } from 'express'
import { body, query } from 'express-validator'
import auth from '../Middleware/auth'
import * as GroupController from '../Controllers/GroupController'

const GroupRouter = Router()

GroupRouter.post('/group/create', auth, GroupController.createGroup)

GroupRouter.patch('/group/insert', auth, GroupController.goGroup)
GroupRouter.patch('/group/patch', auth, GroupController.updateGroupName)
GroupRouter.patch('/group/leave', auth, GroupController.leaveGroup)

GroupRouter.get('/group/invitation', auth, GroupController.getGroupId)
export { GroupRouter }
