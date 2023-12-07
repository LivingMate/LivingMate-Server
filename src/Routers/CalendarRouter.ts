import { Router } from 'express'
import CalendarController from '../Controllers/CalendarController'

const router: Router = Router()

router.get('/', CalendarController.showCalendar)

router.post('/', CalendarController.createCalendarEvent)

router.patch('/', CalendarController.updateCalendarEvent)

router.delete('/', CalendarController.deleteCalendarEvent)

export default router
