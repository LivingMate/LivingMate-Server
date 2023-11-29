import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import { FeedService } from '../Services/index'
import { isPostfixUnaryExpression } from 'typescript'
import { FeedCreateRequestDTO } from '../DTOs/Feed/Request/FeedCreateRequestDTO'
import { FeedUpdateRequestDTO } from '../DTOs/Feed/Request/FeedUpdateRequestDTO'
import CalendarService from '../Services/CalendarService'

/*
get
/feeds
*/

<<<<<<< HEAD
const showFeed = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const groupId: string = req.body.group.id
=======
const showFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const groupId: string = req.body.group.id; 
  
    try {
      const data = await FeedService.showFeed(groupId);
  
      return res
        .send(data);
    } catch (error) {
      next(error);
    }
  };
>>>>>>> d688f92ccb53381a9fca5974a514959c89b4f107

  try {
    const data = await FeedService.showFeed(groupId)

    return res.send(data)
  } catch (error) {
    next(error)
  }
}

const getWeeksDuty = async (req: Request, res: Response) => {
  try {
    // Calculate the start and end dates for the current week
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))

    // Call the CalendarService function to get events for the week
    const weekEvents = await CalendarService.searchCalendarEventsByDateRange(startOfWeek, endOfWeek)

    // Send the results to the main page
    res.render('main', { weekEvents, weekRange: `${startOfWeek.toDateString()} to ${endOfWeek.toDateString()}` })
    // Update 'main' with your actual main page template
  } catch (error) {
    console.error("Error getting week's duty for main page", error)
    res.status(500).send('Internal Server Error')
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

  const userId: string = req.body.user._id
  const feedCreateDto: FeedCreateRequestDTO = req.body
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

  const FeedUpdateRequestDTO: FeedUpdateRequestDTO = req.body
  //const { feedId } = req.params;

<<<<<<< HEAD
  try {
    await FeedService.updateFeedContent
    return res.status(200).send('Feed Updated!')
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

export default {
  getWeeksDuty,
}
=======
    try{
        await FeedService.updateFeedContent(FeedUpdateRequestDTO);
        return res
        .status(200)
        .send('Feed Updated!');
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    } catch (error) {
      next(error);
    }
  };


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



export default{
  showFeed,
  createFeed,
  updateFeed,
  deleteFeed
}



>>>>>>> d688f92ccb53381a9fca5974a514959c89b4f107
