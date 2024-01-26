import express from 'express';
import * as UserController from '../Controllers/UserController'

const UserRouter = express.Router();

UserRouter.patch('/user/setting/:userId', UserController.userSetUpdate)
UserRouter.patch('/user/setting/notification/:userId', UserController.userNotiYesNo)

UserRouter.get('/user/profile/:userId', UserController.getUserProfile)
UserRouter.get('/user/setting/:userId', UserController.getUserSet)
UserRouter.get('/user/setting/notification/:userId', UserController.getUserNotiState)

export { UserRouter }