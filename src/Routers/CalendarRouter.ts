import express from 'express'
import CalendarController from '../Controllers/CalendarController'


const calendarRouter = express.Router();


calendarRouter.get('/', CalendarController.showCalendar)

calendarRouter.post('/', CalendarController.createCalendarEvent)

calendarRouter.patch('/', CalendarController.updateCalendarEvent)

calendarRouter.delete('/', CalendarController.deleteCalendarEvent)

export default calendarRouter;
