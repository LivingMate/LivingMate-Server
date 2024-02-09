import { Router, Request, Response } from "express";
import {body, query} from "express-validator";
import auth from '../Middleware/auth';
import * as NotificationController from '../Controllers/NotificationController'

const NotiRouter = Router();

NotiRouter.get('/notis', auth, NotificationController.getNoti);

export { NotiRouter }