import { Request, Response } from 'express';
import CalendarService from '../Services/CalendarService';


// POST
const createCalendarEvent = async (req: Request, res: Response) => {
  try {
    const calendarData = req.body;
    const newCalendarEvent = await CalendarService.createCalendar(calendarData);
    res.status(201).json(newCalendarEvent);
  } catch (error) {
    console.error('Error creating calendar event', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createScheduleReadyEvent = async (req: Request, res: Response) => {
  try {
    const calendarData = req.body;
    const newScheduleReadyEvent = await CalendarService.createScheduleReady(calendarData);
    res.status(201).json(newScheduleReadyEvent);
  } catch (error) {
    console.error('Error creating schedule-ready event', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createSchedulingEvent = async (req: Request, res: Response) => {
  try {
    const calendarData = req.body;
    const newSchedulingEvent = await CalendarService.createScheduling(calendarData);
    res.status(201).json(newSchedulingEvent);
  } catch (error) {
    console.error('Error creating scheduling events', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// FETCH
const updateCalendarEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const updateData = req.body;
    const updatedCalendarEvent = await CalendarService.updateCalendar(eventId, updateData);
    res.status(200).json(updatedCalendarEvent);
  } catch (error) {
    console.error('Error updating calendar event', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE
const deleteCalendarEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    await CalendarService.deleteCalendar(eventId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting calendar event', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export {
  createCalendarEvent,
  createScheduleReadyEvent,
  createSchedulingEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};
