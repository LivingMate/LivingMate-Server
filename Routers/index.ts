import { Router } from 'express';
import FeedRouter from './FeedRouter'


const router : Router = Router();

router.use(
    '/feed',
    FeedRouter
);

export default router;