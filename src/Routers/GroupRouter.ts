import { Router, Request, Response } from "express";
import {body, query} from "express-validator";
import * as GroupController from "../Controllers/GroupController"

const GroupRouter = Router();

GroupRouter.post('/group/create/:userId',GroupController.createGroup)

GroupRouter.patch('/group/insert/:userId',GroupController.goGroup)
GroupRouter.patch('/group/patch/:userId',GroupController.updateGroupName)
GroupRouter.patch('/group/leave/:userId',GroupController.leaveGroup)

export {GroupRouter};