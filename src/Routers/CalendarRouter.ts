import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'

const CalendarRouter = express.Router()

// CalendarRouter.get('/calendar/:groupId', CalendarController.showCalendar)
// CalendarRouter.get('/calendar/thisweek/:groupId', CalendarController.getThisWeeksDuty)
CalendarRouter.post('/calendar/create/:groupId/:userId', CalendarController.createCalendar)
// CalendarRouter.post('/calendar/schedule/:groupId', CalendarController.createSchedule)
// CalendarRouter.patch('/calendar/:groupId/:userId/:calendarId', CalendarController.updateCalendarEvent)
// CalendarRouter.delete('/calendar/:groupId/:userId/:calendarId', CalendarController.deleteCalendarEvent)

export { CalendarRouter }
