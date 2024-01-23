import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'

const CalendarRouter = express.Router()

CalendarRouter.post('/calendar/create/:groupId/:userId', CalendarController.createCalendar)
CalendarRouter.post('/calendar/schedule/create/:groupId/:userId', CalendarController.createSchedule)
CalendarRouter.post('/calendar/schedule/timeslot/create/:groupId/:scheduleId', CalendarController.createScheduling)

CalendarRouter.patch('/calendar/update/:groupId/:userId/:eventId', CalendarController.updateCalendarEvent)

CalendarRouter.delete('/calendar/delete/:groupId/:userId/:eventId', CalendarController.deleteCalendarEvent)
CalendarRouter.delete('/calendar/schedule/delete/:groupId/:eventId', CalendarController.deleteScheduleEvent)

CalendarRouter.get('/calendar/:groupId', CalendarController.showCalendar)
CalendarRouter.get('/calendar/thisweek/:groupId', CalendarController.getThisWeeksDuty)
CalendarRouter.get('/calendar/schedule/:groupId', CalendarController.showSchedule)
CalendarRouter.get('/calendar/schedule/timeslot/:groupId/:scheduleId', CalendarController.showScheduling)
export { CalendarRouter }
