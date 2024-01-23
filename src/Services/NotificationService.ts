import * as admin from "firebase-admin";

// Firebase Admin SDK 초기화
const serviceAccount = require("../../serviceAcountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 푸시 알림 전송 함수
const sendPushNotification = async (registrationToken: string, notificationType: string) => {
  let title = "";
  let body = "";

  // 알림 종류에 따라 메시지 커스터마이징
  switch (notificationType) {
    case "feedCreated":
      title = "새로운 게시글이 작성되었습니다.";
      body = "게시글을 확인해보세요!";
      break;

    case "calendarCreated":
      title = "새로운 일정이 추가되었습니다.";
      body = "일정을 확인하세요!";
      break;

    case "spendingCreated":
      title = "새로운 지출이 작성되었습니다.";
      body = "지출을 확인해보세요!";
      break;

    case "spendingStart":
      title = "정산이 진행중입니다.";
      body = "이번달 정산 비용을 확인해보세요!";
      break;
    
    case "spendingDone":
      title = "정산을 완료했습니다.";
      break;

    case "emergencySingle":
      title = "개인 메시지가 도착했습니다.";
      body = "지금 확인해보세요!";
      break;

    case "emergencyMulti":
      title = "단체 메시지가 도착했습니다.";
      body = "지금 확인해보세요!";
      break;

    case "newWeek":
      title = "새로운 한 주 입니다";
      body = "이번주의 to-do를 확인하러 가볼까요?";
      break;

    default:
      // 기본적인 메시지
      title = "새로운 알림이 도착했습니다.";
      body = "알림을 확인하세요!";
  }

  const payload: admin.messaging.MessagingPayload = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      type: notificationType, // 알림 종류 식별용 데이터
    },
  };

  try {
    const response = await admin.messaging().send({
      token: registrationToken,
      notification: payload.notification,
      data: payload.data,
    });

    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export {sendPushNotification}
