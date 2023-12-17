import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import * as FeedService from '../Services/FeedService'
import { isPostfixUnaryExpression } from 'typescript'
import { FeedCreateRequestDto } from '../DTOs/Feed/Request/FeedCreateRequestDto'
import { FeedUpdateRequestDto} from '../DTOs/Feed/Request/FeedUpdateRequestDto'
import * as CalendarService from '../Services/CalendarService'


/*
get
/feeds
*/

const showFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const groupId: string = req.params.groupId; 
  
    try {
      const data = await FeedService.showFeed(groupId);
      console.log(data);

      return res.send(data);
    } catch (error) {
      next(error);
    }
  };



/*
  post 
  /feeds
  */

const createFeed = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    throw new Error('Error at Controller: createFeed')
  }

  const userId: string = req.body.user._id
  const feedCreateDto: FeedCreateRequestDto = req.body
  //const { roomId } = req.params;

  try {
    //const data =
    await FeedService.createFeed(feedCreateDto)

    return res.status(200).send('Feed Created!')
    //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
    // );
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

  const FeedUpdateRequestDTO: FeedUpdateRequestDto = req.body
  //const { feedId } = req.params;

  try {
    await FeedService.updateFeedContent(FeedUpdateRequestDTO)
    return res.status(200).send('Feed Updated!')
    //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
    // );
  } catch (error) {
    next(error)
  }
}


 /*
  delete
  /feeds/:feedId
  */

  const deleteFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error('Error at Controller: updateFeed');
    }

    const feedId  = parseInt(req.params.feedId);

    try{
       await FeedService.deleteFeed(feedId);
        return res
        .status(200)
        .send('Feed Deleted!');
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    } catch (error) {
      next(error);
    }
  };



export{
  showFeed,
  createFeed,
  updateFeed,
  deleteFeed
}




