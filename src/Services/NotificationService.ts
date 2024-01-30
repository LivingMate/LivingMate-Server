import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import * as UserService from './User/UserService'
import * as UserServiceUtils from './User/UserServiceUtils'

const makeNotification = async (groupId: string, userId: string, notificationType: string) => {
  try {
    const resUserName = await UserServiceUtils.getUserNameByUserId(userId)
    let notificationText = ''

    switch (notificationType) {
      case 'createFeed':
        notificationText = `${resUserName}가 새로운 게시글을 작성했습니다.`
        break
      case 'createCalendar':
        notificationText = `${resUserName}가 새로운 일정을 등록했습니다.`
        break
      case 'createRepeatCalendar':
        notificationText = `${resUserName}가 새로운 반복 일정을 등록했습니다.`
        break
      case 'createSchedule':
        notificationText = `${resUserName}가 새로운 일정 조율을 등록했습니다.`
        break
      case 'createBudget':
        notificationText = `${resUserName}가 새로운 지출을 추가했습니다.`
        break
      case 'startBudget':
        notificationText = `정산을 시작했습니다.`
        break
      case 'endBudget':
        notificationText = `정산이 완료되었습니다.`
        break
      case 'newUser':
        notificationText = `새로운 메이트 ${resUserName}가 들어왔습니다.`
        break

      default:
        notificationText = '알 수 없는 알림 타입입니다.'
        break
    }

    await prisma.notification.create({
      data: {
        groupId: groupId,
        userId: userId,
        text: notificationText,
        isDelete: false,
      },
    })
  } catch (error) {
    console.error('error :: service/notification/makeNotification', error)
    throw error
  }
}

const getNotification = async (groupId:string, userId:string) => {
  try {

  } catch (error) {
    console.error('error :: service/notification/getNotification', error)
    throw error
  }
}


export { makeNotification }
