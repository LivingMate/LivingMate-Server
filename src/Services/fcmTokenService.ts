// fcmTokenService.ts
import admin from 'firebase-admin';

class FcmTokenService {
  static registerFcmToken(userId: string, fcmToken: string): void {
    // Firebase Realtime Database에 FCM 토큰 저장 로직
    admin.database().ref(`/users/${userId}/fcmToken`).set(fcmToken);
  }
}

export default FcmTokenService;
