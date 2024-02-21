import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'
import auth from '../Middleware/auth';

const CalendarRouter = express.Router()

CalendarRouter.post('/calendar/create', auth, CalendarController.createCalendar)
CalendarRouter.post('/calendar/create/schedule', auth, CalendarController.createSchedule)
CalendarRouter.post('/calendar/create/schedule/timeslot/:scheduleId', auth, CalendarController.createScheduling)

CalendarRouter.patch('/calendar/update/:calendarId', auth, CalendarController.updateCalendarEvent)

CalendarRouter.delete('/calendar/delete/:calendarId', auth, CalendarController.deleteCalendarEvent)
CalendarRouter.delete('/calendar/delete/schedule/:scheduleId', auth, CalendarController.deleteScheduleEvent)

CalendarRouter.get('/calendar', auth, CalendarController.showCalendar)
CalendarRouter.get('/calendar/:calendarId', auth, CalendarController.showOneCalendar)
CalendarRouter.get('/calendar/get/month/:dateString', auth, CalendarController.showMonthCalendar)
CalendarRouter.get('/calendar/get/week', auth, CalendarController.getThisWeeksDuty)
CalendarRouter.get('/calendar/schedule/schedule', auth, CalendarController.showSchedule)
CalendarRouter.get('/calendar/schedule/timeslot/:scheduleId', auth, CalendarController.showScheduling)
export { CalendarRouter }
