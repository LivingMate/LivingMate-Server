import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import * as FeedService from '../Services/FeedService'
import { isPostfixUnaryExpression } from 'typescript'
import { FeedCreateRequestDto } from '../DTOs/Feed/Request/FeedCreateRequestDto'
import { FeedUpdateRequestDto } from '../DTOs/Feed/Request/FeedUpdateRequestDto'
import * as GroupServiceUtils from '../Services/Group/GroupServiceUtils'



/*
get
/feeds
*/

const showFeed = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const userId: string = req.body.user.id;
  const groupId: string = await GroupServiceUtils.findGroupIdByUserId(userId);
  

  try {
    const data = await FeedService.showFeed(groupId)
    console.log(data)
    

    return res.send(data)
  } catch (error) {
    next(error)
  }
}

/*
  post 
  /feeds
  */

const createFeed = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    throw new Error('Error at Controller: createFeed')
  }

  const userId: string = req.body.user.id;
  const groupId: string = await GroupServiceUtils.findGroupIdByUserId(userId);
  const feedcontent: string = req.body.content;
  

  try {
    const data = await FeedService.createFeed(userId, groupId, feedcontent)

    return res.status(200).send(data)

  } catch (error) {
    next(error)
  }
}

/*
  patch
  /feeds/:feedId
*/

const updateFeed = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    throw new Error('Error at Controller: updateFeed')
  }

  const content: string = req.body.content;
  const strFeedId = req.params.feedId;
  const feedId = parseInt(strFeedId);

  try {
    const data = await FeedService.updateFeedContent(feedId, content)
    return res.status(200).send(data);
  } catch (error) {
    next(error)
  }
}

/*
  pin!! 
  patch
  /feeds/:feedId
*/

const pinFeed = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    throw new Error('Error at Controller: updateFeed')
  }

  const strFeedId = req.params.feedId;
  const feedId = parseInt(strFeedId);
  

  try {
    const data = await FeedService.pinFeed(feedId)
    console.log(data);
    return res.status(200).send(data);
  } catch (error) {
    next(error)
  }
}


/*
  delete
  /feeds/:feedId
  */

const deleteFeed = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    throw new Error('Error at Controller: updateFeed')
  }

  const feedId = parseInt(req.params.feedId)

  try {
    await FeedService.deleteFeed(feedId)
    return res.status(200).send('Feed Deleted!')
    //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
    // );
  } catch (error) {
    next(error)
  }
}

export { showFeed, createFeed, updateFeed, deleteFeed, pinFeed }
