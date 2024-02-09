import express from 'express';
import auth from '../Middleware/auth';
import * as UserController from '../Controllers/UserController'

const UserRouter = express.Router();

UserRouter.patch('/user/update/setting', auth, UserController.userSetUpdate)
UserRouter.patch('/user/update/setting/notification', auth, UserController.userNotiYesNo)
UserRouter.patch('/user/leave', auth, UserController.quitUser)

UserRouter.get('/user/mypage', auth, UserController.getUserProfile)
UserRouter.get('/user/all', auth, UserController.getAllMember)
UserRouter.get('/user/setting', auth, UserController.getUserSet)
UserRouter.get('/user/setting/notification', auth, UserController.getUserNotiState)


export { UserRouter }