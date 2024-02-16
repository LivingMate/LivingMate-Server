import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { FeedCreateRequestDto } from '../DTOs/Feed/Request/FeedCreateRequestDto'
import { FeedCreateResponseDto } from '../DTOs/Feed/Response/FeedCreateResponseDto'
import { FeedUpdateResponseDto } from '../DTOs/Feed/Response/FeedUpdateResponseDto'
import * as UserServiceUtils from './User/UserServiceUtils'
import * as NotificationService from './NotificationService'
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
    await NotificationService.makeNotification(groupId, userId, 'createFeed')

    const data: FeedCreateResponseDto = {
      feedId: event.id,
      userId: event.userId,
      userName: resUserName,
      userColor: resUserColor,
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

    const resUserName = await UserServiceUtils.getUserNameByUserId(updatedEvent.userId)
    const resUserColor = await UserServiceUtils.findUserColorByUserId(updatedEvent.userId)

    const FeedToReturn: FeedUpdateResponseDto = {
      feedId: updatedEvent.id,
      userId: updatedEvent.userId,
      userName: resUserName,
      userColor: resUserColor,
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
const pinFeed = async (FeedId: number, Pinned: boolean) => {
  try{
    const pinnedFeed = await prisma.feed.update({
      where: {
        id: FeedId,
      },
      data: {
        pin: Pinned
      },
    })

    const resUserName = await UserServiceUtils.getUserNameByUserId(pinnedFeed.userId)
    const resUserColor = await UserServiceUtils.findUserColorByUserId(pinnedFeed.userId)
  
    const data = {
      feedId: pinnedFeed.id,
      userId: pinnedFeed.userId,
      userName: resUserName,
      userColor: resUserColor,
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
    
  } catch (error) {
    throw new Error('Error deleting feed')
  }
}


const showFeed = async (GroupId: string) => {
  const Feeds = await prisma.feed.findMany({
    where: {
      groupId: GroupId,
    },
    orderBy: {
      id: 'desc',
    },
  })

  let FeedsToShow:FeedCreateResponseDto[] =[];

  await Promise.all(
    Feeds.map(async (feed)=>{
      let resUserName = await UserServiceUtils.getUserNameByUserId(feed.userId)
      let resUserColor = await UserServiceUtils.findUserColorByUserId(feed.userId)

      FeedsToShow.push({
        feedId: feed.id,
        userId: feed.userId,
        groupId: feed.groupId,
        userName : resUserName,
        userColor : resUserColor,
        content: feed.content,
        createdAt : feed.createdAt,
        pinned: feed.pin
      })

    })
  )

  return FeedsToShow;
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
  
  const resUserName = await UserServiceUtils.getUserNameByUserId(Feed.userId)
  const resUserColor = await UserServiceUtils.findUserColorByUserId(Feed.userId)
  
    const data = {
      feedId: Feed.id,
      userId: Feed.userId,
      userName: resUserName,
      userColor: resUserColor,
      groupId: Feed.groupId,
      content: Feed.content,
      createdAt: Feed.createdAt,
      pin: Feed.pin,
    }

  return data;
}


export { createFeed, deleteFeed, findFeedByFeedId, pinFeed, showFeed, updateFeedContent }
