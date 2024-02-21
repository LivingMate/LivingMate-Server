import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import * as UserServiceUtils from './User/UserServiceUtils'
import * as GroupServiceUtils from './Group/GroupServiceUtils'

const makeNotification = async (groupId: string, userId: string, notificationType: string) => {
  try {
    const resUserName = await UserServiceUtils.getUserNameByUserId(userId)
    let notificationText = ''

    switch (notificationType) {
      case 'createFeed':
        notificationText = `${resUserName}님이 새로운 게시글을 작성했습니다.`
        break
      case 'createCalendar':
        notificationText = `${resUserName}님이 새로운 일정을 등록했습니다.`
        break
      case 'createRepeatCalendar':
        notificationText = `${resUserName}님이 새로운 반복 일정을 등록했습니다.`
        break
      case 'createSchedule':
        notificationText = `${resUserName}님이 새로운 일정 조율을 등록했습니다.`
        break
      case 'createBudget':
        notificationText = `${resUserName}님이 새로운 지출을 추가했습니다.`
        break
      case 'startBudget':
        notificationText = `정산을 시작했습니다.`
        break
      case 'endBudget':
        notificationText = `정산이 완료되었습니다.`
        break
      case 'newUser':
        notificationText = `새로운 메이트 ${resUserName}님이 들어왔습니다.`
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


const getUserNotiState = async ( userId:string ) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)

    const notiState = await prisma.userNoti.findUnique({
      where: {
        userId: user.id
      }
    })
    if (notiState) {
      return notiState.state
    } else {
      return 'error'
    }
  } catch (error) {
    console.error('error :: service/notification/getUserNotiState', error)
    throw error
  }
}

const getUserNotiTime = async ( userId:string ) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)

    const notiTime = await prisma.userNoti.findUnique({
      where: {
        userId: user.id
      }
    })
    if (notiTime) {
      return notiTime.updatedAt
    } else {
      return 'error'
    }
  } catch (error) {
    console.error('error :: service/notification/getUserNotiTime', error)
    throw error
  }
}

const getNotification = async ( userId:string ) => {
  try {
    const user = await UserServiceUtils.findUserById(userId)
    const group = await GroupServiceUtils.findGroupById(user.groupId)
    const notiState = await getUserNotiState(user.id)
    const notiTime = await getUserNotiTime(user.id)

    if (notiState !== true || notiTime === 'error') {
      return '알림이 없습니다';
    }

    const notis = await prisma.notification.findMany({
      where: {
        groupId: group.id,
        createdAt: {
          gte: notiTime
        }
      },
      orderBy: {
        id: 'desc',
      }
    })

    const formattedNotis = notis.map(({ id, text, createdAt }) => ({
      Id: id,
      text,
      createdAt,
    }));

    const data = {
      Notifications : formattedNotis,
    };

    return data;

  } catch (error) {
    console.error('error :: service/notification/getNotification', error)
    throw error
  }
}


export { 
  makeNotification,
  getUserNotiState,
  getUserNotiTime,
  getNotification
 }
