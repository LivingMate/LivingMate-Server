import { Request, Response, NextFunction } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import * as CalendarService from '../Services/Calendar/CalendarService'
import * as GroupServiceUtils from '../Services/Group/GroupServiceUtils'
import { CalendarCreateDto } from '../DTOs/Calendar/Request/CalendarCreateDto'
import { CalendarUpdateDto } from '../DTOs/Calendar/Request/CalendarUpdateDto'
import { ScheduleCreateDto } from '../DTOs/Calendar/Request/ScheduleCreateDto'
import { SchedulingCreateDto } from '../DTOs/Calendar/Request/SchedulingCreateDto'
import statusCode from '../modules/statusCode'
import message from '../modules/message'
import util from '../modules/util'

// POST -------------------------------------------------------------------------------
const createCalendar = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
  const calendarCreateDto: CalendarCreateDto = req.body

  try {
    const data = await CalendarService.createCalendar(userId, groupId, calendarCreateDto)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.CREATE_CAL_SUCCESS, data))
  } catch (error) {
    console.error('Error creating calendar event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const createSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
  const scheduleCreateDto: ScheduleCreateDto = req.body

  try {
    const data = await CalendarService.createSchedule(groupId, userId, scheduleCreateDto)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.CREATE_SCDL_SUCCESS, data))
  
  } catch (error) {
    console.error('Error creating schedule event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const createScheduling = async (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  try {
    const userId = req.body.user.id;
    const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
    const scheduleId = parseInt(req.params.scheduleId)
    const schedulingCreateDto: SchedulingCreateDto[] = req.body;

    const data = await CalendarService.createScheduling(groupId, scheduleId, schedulingCreateDto)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.CREATE_TS_SUCCESS, data))
  
  } catch (error) {
    console.error('Error creating scheduling events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// FETCH
const updateCalendarEvent = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }
  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
  const calendarId = parseInt(req.params.calendarId)
  const calendarUpdateDto: CalendarUpdateDto = req.body

  try {
    const data = await CalendarService.updateCalendar(userId, groupId, calendarId, calendarUpdateDto)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.UPDATE_CAL_SUCCESS, data))
  
  } catch (error) {
    console.error('Error updating calendar event', error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
}

// DELETE
const deleteCalendarEvent = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }
  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
  const calenarId = parseInt(req.params.calendarId)

  try {
    const data = await CalendarService.deleteCalendar(userId, groupId, calenarId)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.DELETE_CAL_SUCCESS))
  
  } catch (error) {
    console.error('Error deleting calendar event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const deleteScheduleEvent = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
  }

  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
  const scheduleId = parseInt(req.params.scheduleId)

  try {
    const data = await CalendarService.deleteSchedule(groupId, scheduleId)
    console.log(data)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.DELETE_SCDL_TS_SUCCESS))
  
  } catch (error) {
    console.error('Error deleting schedule&scheduling event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}


// GET
const getThisWeeksDuty = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);

  try {
    const thisWeeksDuty = await CalendarService.getThisWeeksDuty(groupId)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.READ_THISWEEK_SUCCESS, thisWeeksDuty))
  
  } catch (error) {
    console.error("Error getting this week's duty", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showCalendar = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);

  try {
    const calendarEvents = await CalendarService.showCalendar(groupId)
    res.status(200).json(calendarEvents)
    console.log(calendarEvents)
  } catch (error) {
    console.error('Error retrieving calendar events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showOneCalendar = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const calendarId = parseInt(req.params.calendarId)

  try {
    const calendarEvents = await CalendarService.showOneCalendar(calendarId)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.READ_ONE_CAL_SUCCESS, calendarEvents))

  } catch (error) {
    console.error('Error getting one calendar events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showMonthCalendar = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
  const dateString = req.params.dateString

  try {
    const calendarEvents = await CalendarService.showMonthCalendar(groupId, dateString)
    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.READ_THIMONTH_SUCCESS, calendarEvents))

  } catch (error) {
    console.error('Error getting month calendar events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showSchedule = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);

  try {
    const scheduleEvents = await CalendarService.showSchedule(groupId)
    res.status(200).json(scheduleEvents)
    console.log(scheduleEvents)
  } catch (error) {
    console.error('Error retrieving schedule events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showScheduling = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  const groupId = await GroupServiceUtils.findGroupIdByUserId(userId);
  
  try {
    const scheduleId = parseInt(req.params.scheduleId, 10)
    const scheduleEvents = await CalendarService.showScheduling(groupId, scheduleId)
    res.status(200).json(scheduleEvents)
    console.log(scheduleEvents)
  } catch (error) {
    console.error('Error retrieving schedule events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export {
  createCalendar,
  createSchedule,
  createScheduling,
  updateCalendarEvent,
  deleteCalendarEvent,
  deleteScheduleEvent,
  getThisWeeksDuty,
  showCalendar,
  showOneCalendar,
  showMonthCalendar,
  showSchedule,
  showScheduling
}
