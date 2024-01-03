import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { FeedCreateDto } from '../DTOs/Feed/Request/FeedCreateDto'
import { FeedCreateResponseDto } from '../DTOs/Feed/Response/FeedCreateResponseDto'
import { FeedUpdateDto } from '../DTOs/Feed/Request/FeedUpdateDto'
import { FeedUpdateResponseDto } from '../DTOs/Feed/Response/FeedUpdateResponseDto'
import * as UserService from './UserService'
import message from '../modules/message'


// -------utils--------
// 존재하는 feedId인지 찾기
const findFeedEventById = async (eventId: number) => {
    try {
      const event = await prisma.feed.findUnique({
        where: {
          id: eventId,
        },
      })
  
      return event
    } catch (error) {
      console.error('error :: service/feed/feedService/findFeedEventById', error)
      throw error
    }
  }

  const findUserColorByUserId = async (userId: string) => {
    try {
      const data = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
  
      if (data) {
        return data.userColor
      } else {
        return 'error'
      }
    } catch (error) {
      console.error('error :: service/feed/findUserColorByUserId', error)
      throw error
    }
  }

// ------- real service -------
//신규 피드 등록
const createFeed = async (
  userId: string,
  groupId: string,
  feedCreateDto: FeedCreateDto,
): Promise<FeedCreateResponseDto> => {
  try {
    const event = await prisma.feed.create({
      data: {
        userId: userId,
        groupId: groupId,
        text: feedCreateDto.text,
        createdAt: feedCreateDto.date,
        pin: feedCreateDto.pin,
      },
    })

    const resUserName = await UserService.getUserNameByUserId(event.userId);
    const resUserColor = await findUserColorByUserId(event.userId);

    const data: FeedCreateResponseDto = {
      feedId: event.id,
      userId: event.userId,
      userName: resUserName,
      userColor: resUserColor,
      groupId: event.groupId,
      text: event.text,
      date: event.createdAt,
      pin: event.pin,
    }
    return data
  } catch (error) {
    console.error('error :: service/feed/createFeed', error)
    throw error
  }
}

//피드 보여주기 : 객체 타입의 배열로 반환됨! 우선 위의 10개만 반환되게 했음.  //
const showFeed = async (GroupId: string) => {
  const Feeds = await prisma.feed.findMany({
    where: {
      groupId: GroupId,
    },
    orderBy: {
      id: 'desc',
    },
  })
  return Feeds
}

//피드내용 수정
const updateFeedContent = async (
    userId: string, 
    groupId: string, 
    eventId: number,
    feedUpdateDto: FeedUpdateDto) => {
  try {
    const existingEvent = await findFeedEventById(eventId)
    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    const updatedEvent = await prisma.feed.update({
      where: {
        id: eventId,
      },
      data: {
        userId: userId,
        groupId: groupId,
        text: feedUpdateDto.text,
        createdAt: feedUpdateDto.date,
        pin: feedUpdateDto.pin,
      },
    })

    return updatedEvent
  } catch (error) {
    console.error('error :: service/calendar/updateCalendar', error)
    throw error
  }
}

//피드 고정 -> 이거 업데이트에 한번에 합칠 수도 있는데.... 우선 모르고 걍 만들었으니 놔둬 봄...
const pinFeed = async (FeedId: number) => {
  const pinnedFeed = await prisma.feed.update({
    where: {
      id: FeedId,
    },
    data: {
      pin: true,
    },
  })
  return pinnedFeed //리턴값을 어떻게 줘야 할지 모르겠는디.... 얘를 줘야 하나.. 아님 showFeed()를 걸어줘야 하나?
}

//피드 삭제
const deleteFeed = async (FeedId: number) => {
  try {
    const toBeDeleted = await findFeedByFeedId(FeedId)
    if (!toBeDeleted) {
      throw new Error('Feed not found')
    }

    await prisma.feed.delete({
      where: {
        id: FeedId,
      },
    })

    return 0
    //삭제 이후에는 null값이나 빈 객체를 반환하기 때문에... 왜 Hous 팀이 msg를 만들었는지 알겠음. msg를 만들거나.. 해아 할 것 같음
  } catch (error) {
    throw new Error('Error deleting feed')
  }
}

//공동일정 조율

//피드 찾기
const findFeedByFeedId = async (FeedId: number) => {
  const Feed = await prisma.feed.findUnique({
    where: {
      id: FeedId,
    },
  })
  if (!Feed) {
    throw new Error('No Feed Found!')
  }
  return Feed
}

export { createFeed, deleteFeed, findFeedByFeedId, pinFeed, showFeed, updateFeedContent }
