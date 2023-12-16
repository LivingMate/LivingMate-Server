import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'


const CalendarRouter = express.Router();


CalendarRouter.get('/', CalendarController.showCalendar)
CalendarRouter.post('/', CalendarController.createCalendarEvent)
CalendarRouter.patch('/', CalendarController.updateCalendarEvent)
CalendarRouter.delete('/', CalendarController.deleteCalendarEvent)

export {CalendarRouter};
