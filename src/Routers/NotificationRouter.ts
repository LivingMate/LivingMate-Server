import { Router, Request, Response } from "express";
import {body, query} from "express-validator";
import * as NotificationController from '../Controllers/NotificationController'

const NotiRouter = Router();

NotiRouter.get('/notis/:userId',NotificationController.getNoti);

export { NotiRouter }