// fcmTokenRouter.ts
import express from 'express';
import FcmTokenController from '../Controllers/fcmTokenController';

const router = express.Router();

// POST /registerToken 엔드포인트에 대한 라우팅
router.post('/registerToken', FcmTokenController.registerFcmToken);

export default router;
