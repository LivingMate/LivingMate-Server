import { Router, Request, Response } from "express";
import auth from '../Middleware/auth';
import * as FeedController from "../Controllers/FeedController"

const FeedRouter = Router();

FeedRouter.get('/feed', auth, FeedController.showFeed);
FeedRouter.get('/feed/:feedId',FeedController.getFeed);
FeedRouter.post('/feed', auth, FeedController.createFeed);
FeedRouter.patch('/feed/:feedId',FeedController.updateFeed);
FeedRouter.patch('/feed/pin/:feedId',FeedController.pinFeed);
FeedRouter.delete('/feed/:feedId', FeedController.deleteFeed);

export {FeedRouter};