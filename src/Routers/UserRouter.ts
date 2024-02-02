import express from 'express';
import * as UserController from '../Controllers/UserController'

const UserRouter = express.Router();

UserRouter.patch('/user/setting/:userId', UserController.userSetUpdate)
UserRouter.patch('/user/setting/notification/:userId', UserController.userNotiYesNo)
UserRouter.patch('/user/quit/:userId', UserController.quitUser)

UserRouter.get('/user/mypage/:userId', UserController.getUserProfile)
UserRouter.get('/user/all/:userId', UserController.getAllMember)
UserRouter.get('/user/setting/:userId', UserController.getUserSet)
UserRouter.get('/user/setting/notification/:userId', UserController.getUserNotiState)


export { UserRouter }