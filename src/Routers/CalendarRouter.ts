import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'

const CalendarRouter = express.Router()

CalendarRouter.get('/calendar/:groupId', CalendarController.showCalendar)
CalendarRouter.get('/calendar/:groupId/thisweek', CalendarController.getThisWeeksDuty)
CalendarRouter.post('/calendar/:groupId/:userId/create', CalendarController.createCalendar)
CalendarRouter.post('/calendar/:groupId/create', CalendarController.createSchedule)
CalendarRouter.patch('/calendar/:groupId/:userId/:calendarId/update', CalendarController.updateCalendarEvent)
CalendarRouter.delete('/calendar/:groupId/:userId/:calendarId/delete', CalendarController.deleteCalendarEvent)

export { CalendarRouter }
