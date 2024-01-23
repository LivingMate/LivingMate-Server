// fcmTokenController.ts
import { Request, Response } from 'express';
import FcmTokenService from '../Services/fcmTokenService';

class FcmTokenController {
  static registerFcmToken(req: Request, res: Response): void {
    const { userId, fcmToken } = req.body;

    // Service 메서드 호출
    FcmTokenService.registerFcmToken(userId, fcmToken);

    res.send('FCM 토큰이 등록되었습니다.');
  }
}

export default FcmTokenController;
