import { Request, Response, NextFunction } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import * as CalendarService from '../Services/Calendar/CalendarService'
import * as CalendarServiceUtils from '../Services/Calendar/CalendarServiceUtils'
import { CalendarCreateDto } from '../DTOs/Calendar/Request/CalendarCreateDto'
import { CalendarUpdateDto } from '../DTOs/Calendar/Request/CalendarUpdateDto'
import { CalendarBaseDto } from '../DTOs/Calendar/CalendarBaseDto'
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

  const userId = req.params.userId
  const calendarCreateDto: CalendarCreateDto = req.body
  const groupId = req.params.groupId

  try {
    const data = await CalendarService.createCalendar(userId, groupId, calendarCreateDto)
    console.log(data)
    res.status(201).json(data)
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

  const groupId = req.params.groupId
  const userId = req.params.userId
  const scheduleCreateDto: ScheduleCreateDto = req.body

  try {
    const data = await CalendarService.createSchedule(groupId, userId, scheduleCreateDto)
    console.log(data)
    res.status(201).json(data)
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
    const schedulingCreateDto: SchedulingCreateDto[] = req.body;
    const groupId = req.params.groupId
    const scheduleId = parseInt(req.params.scheduleId, 10)

    const data = await CalendarService.createScheduling(groupId, scheduleId, schedulingCreateDto)
    console.log(data)
    res.status(201).json(data)
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

  const eventId = parseInt(req.params.eventId)
  const userId = req.params.userId
  const groupId = req.params.groupId
  const calendarUpdateDto: CalendarUpdateDto = req.body

  try {
    const data = await CalendarService.updateCalendar(userId, groupId, eventId, calendarUpdateDto)
    console.log(data)
    res.status(200).send(data)
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
  const userId = req.params.userId
  const groupId = req.params.groupId;
  const eventId = parseInt(req.params.eventId, 10)

  try {
    const data = await CalendarService.deleteCalendar(userId, groupId, eventId)
    console.log(data)
    res.status(204).send()
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

  const groupId = req.params.groupId;
  const eventId = parseInt(req.params.eventId, 10)

  try {
    const data = await CalendarService.deleteSchedule(groupId, eventId)
    console.log(data)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting schedule&scheduling event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}


// GET
const getThisWeeksDuty = async (req: Request, res: Response) => {
  try {
    const groupId: string = req.params.groupId
    const thisWeeksDuty = await CalendarService.getThisWeeksDuty(groupId)
    res.status(200).json(thisWeeksDuty)
    console.log(thisWeeksDuty)
  } catch (error) {
    console.error("Error getting this week's duty", error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showCalendar = async (req: Request, res: Response) => {
  try {
    const groupId: string = req.params.groupId
    const calendarEvents = await CalendarService.showCalendar(groupId)
    res.status(200).json(calendarEvents)
    console.log(calendarEvents)
  } catch (error) {
    console.error('Error retrieving calendar events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showSchedule = async (req: Request, res: Response) => {
  try {
    const groupId: string = req.params.groupId
    const scheduleEvents = await CalendarService.showSchedule(groupId)
    res.status(200).json(scheduleEvents)
    console.log(scheduleEvents)
  } catch (error) {
    console.error('Error retrieving schedule events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const showScheduling = async (req: Request, res: Response) => {
  try {
    const groupId: string = req.params.groupId
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
  showSchedule,
  showScheduling
}
