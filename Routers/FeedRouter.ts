import { Router, Request, Response } from "express";
import {body, query} from "express-validator";
import FeedController from "../Controllers/FeedController"

const router = Router();



router.get('/feed',FeedController.showFeed);
router.post('/feed',FeedController.createFeed);
router.patch('/feed/:feedId',FeedController.updateFeed);
router.delete('/feed/:feedId', FeedController.deleteFeed);

export default router;