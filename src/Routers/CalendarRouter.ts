import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'


const CalendarRouter = express.Router();


CalendarRouter.get('/calendar/:groupId', CalendarController.showCalendar)
CalendarRouter.post('/calendar', CalendarController.createCalendarEvent)
CalendarRouter.patch('/calendar/:calendarId', CalendarController.updateCalendarEvent)
CalendarRouter.delete('/calendar/:calendarId', CalendarController.deleteCalendarEvent)


export {CalendarRouter};
