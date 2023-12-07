import { Request, Response } from 'express'
import CalendarService from '../Services/CalendarService'
import { CalendarRightCreateDto } from '../DTOs/Calendar/Request/CalendarRightCreateDto'
import { CalendarBaseDto } from '../DTOs/Calendar/CalendarBaseDto'
import { ScheduleReadyCreateDto } from '../DTOs/Calendar/Request/ScheduleReadyCreateDto'
import { SchedulingCreateDto } from '../DTOs/Calendar/Request/SchedulingCreateDto'

// POST
const createCalendarEvent = async (req: Request, res: Response) => {
  try {
    const calendarData = req.body
    const newCalendarEvent = await CalendarService.createCalendar(calendarData)
    res.status(201).json(newCalendarEvent)
  } catch (error) {
    console.error('Error creating calendar event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const createScheduleReadyEvent = async (req: Request, res: Response) => {
  try {
    const calendarData = req.body
    const newScheduleReadyEvent = await CalendarService.createScheduleReady(calendarData)
    res.status(201).json(newScheduleReadyEvent)
  } catch (error) {
    console.error('Error creating schedule-ready event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const createSchedulingEvent = async (req: Request, res: Response) => {
  try {
    const calendarData = req.body
    const newSchedulingEvent = await CalendarService.createScheduling(calendarData)
    res.status(201).json(newSchedulingEvent)
  } catch (error) {
    console.error('Error creating scheduling events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// FETCH
const updateCalendarEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10)
    const updateData = req.body
    const updatedCalendarEvent = await CalendarService.updateCalendar(eventId, updateData)
    res.status(200).json(updatedCalendarEvent)
  } catch (error) {
    console.error('Error updating calendar event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// DELETE
const deleteCalendarEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10)
    await CalendarService.deleteCalendar(eventId)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting calendar event', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// GET
const getThisWeeksDuty = async (req: Request, res: Response) => {
  try {
    const groupId: string = req.params.groupId
    const thisWeeksDuty = await CalendarService.searchThisWeeksDuty(groupId)
    res.status(200).json(thisWeeksDuty)
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
  } catch (error) {
    console.error('Error retrieving calendar events', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default {
  createCalendarEvent,
  createScheduleReadyEvent,
  createSchedulingEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getThisWeeksDuty,
  showCalendar,
}
