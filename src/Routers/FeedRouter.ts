import { Router, Request, Response } from "express";
import auth from '../Middleware/auth';
import * as FeedController from "../Controllers/FeedController"

const FeedRouter = Router();

FeedRouter.get('/feed/:groupId',auth,FeedController.showFeed);
FeedRouter.post('/feed/:groupId/:userId',FeedController.createFeed);
FeedRouter.patch('/feed/:feedId',FeedController.updateFeed);
FeedRouter.patch('/feed/pin/:feedId',FeedController.pinFeed);
FeedRouter.delete('/feed/:feedId', FeedController.deleteFeed);

export {FeedRouter};