import express from 'express'
import CalendarController from '../Controllers/CalendarController'


const calendarRouter = express.Router();


calendarRouter.get('/:calendar', CalendarController.showCalendar)
calendarRouter.post('/:calendar', CalendarController.createCalendarEvent)
calendarRouter.patch(':calendar', CalendarController.updateCalendarEvent)
calendarRouter.delete('/:calendar', CalendarController.deleteCalendarEvent)

export default calendarRouter;
