import express from 'express'
import * as CalendarController from '../Controllers/CalendarController'


const router = express.Router();


router.get('/', CalendarController.showCalendar)
router.post('/', CalendarController.createCalendarEvent)
router.patch('/', CalendarController.updateCalendarEvent)
router.delete('/', CalendarController.deleteCalendarEvent)

export default router;
