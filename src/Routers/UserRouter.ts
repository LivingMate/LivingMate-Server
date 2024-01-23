import express from 'express';
import * as UserController from '../Controllers/UserController'

const UserRouter = express.Router();

UserRouter.get('/profile/:userId', UserController.getUserProfile)
// UserRouter.patch('/user/:groupId', UserController.getUserProfile)

export { UserRouter }