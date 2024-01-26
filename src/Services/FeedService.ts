import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { FeedCreateRequestDto } from '../DTOs/Feed/Request/FeedCreateRequestDto'
import { FeedCreateResponseDto } from '../DTOs/Feed/Response/FeedCreateResponseDto'
import { FeedUpdateResponseDto } from '../DTOs/Feed/Response/FeedUpdateResponseDto'
import { FeedPinRequestDto } from '../DTOs/Feed/Request/FeedPinRequestDto'
import * as UserServiceUtils from './User/UserServiceUtils'
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

// ------- real service -------
//신규 피드 등록
const createFeed = async (userId: string, groupId: string, content: string): Promise<FeedCreateResponseDto> => {
  try {
    const event = await prisma.feed.create({
      data: {
        userId: userId,
        groupId: groupId,
        content: content,
      },
    })

    const resUserName = await UserServiceUtils.getUserNameByUserId(event.userId)
    const resUserColor = await UserServiceUtils.findUserColorByUserId(event.userId)

    const data: FeedCreateResponseDto = {
      feedId: event.id,
      userId: event.userId,
      //userName: resUserName,
      //userColor: resUserColor,
      groupId: event.groupId,
      content: event.content,
      createdAt: event.createdAt,
      pinned: event.pin,
    }
    return data
  } catch (error) {
    console.error('error :: service/feed/createFeed', error)
    throw error
  }
}

//피드내용 수정
const updateFeedContent = async (
  //userId: string, groupId: string,
  feedId: number,
  content: string,
) => {
  try {
    const existingEvent = await findFeedEventById(feedId)
    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    const updatedEvent = await prisma.feed.update({
      where: {
        id: feedId,
      },
      data: {
        content: content,
      },
    })

    //const resUserName = await UserService.getUserNameByUserId(updatedEvent.userId)
    //const resUserColor = await UserService.findUserColorByUserId(updatedEvent.userId)

    const FeedToReturn: FeedUpdateResponseDto = {
      feedId: updatedEvent.id,
      userId: updatedEvent.userId,
      //userName: resUserName,
      //userColor: resUserColor,
      groupId: updatedEvent.groupId,
      content: updatedEvent.content,
      createdAt: updatedEvent.createdAt,
      pinned: updatedEvent.pin,
    }
    return FeedToReturn
  } catch (error) {
    console.error('error :: service/feed/updatefeed', error)
    throw error
  }
}

//피드 고정
const pinFeed = async (FeedId: number, pin:boolean) => {
  try{
    const pinnedFeed = await prisma.feed.update({
      where: {
        id: FeedId,
      },
      data: {
        pin: pin
      },
    })
  
    const data = {
      feedId: pinnedFeed.id,
      userId: pinnedFeed.userId,
      groupId: pinnedFeed.groupId,
      content: pinnedFeed.content,
      createdAt: pinnedFeed.createdAt,
      pin: pinnedFeed.pin,
    }
  
    return(data)
  } catch (error) {
    console.error('error :: service/feed/pinfeed', error)
    throw error
  }
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

//피드 보여주기 : 객체 타입의 배열로 반환됨!
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
