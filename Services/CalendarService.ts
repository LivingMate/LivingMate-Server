import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { CalendarBaseDTO } from '../DTOs/Calendar/CalendarBaseDTO';
// 이 파일 아직 미완성임! 천천히 해볼게
const createCalendarEvent = async (CalendarBaseDTO: CalendarBaseDTO) => {
  try {
    const newEvent = await prisma.calendarRight.create({
      data: {
        userId: CalendarBaseDTO.userId,
        title: CalendarBaseDTO.dutyName,
        dateStart: CalendarBaseDTO.date,
        timeStart: CalendarBaseDTO.timeStart,
        timeEnd: CalendarBaseDTO.timeEnd,
      },
    });

    // Your logic here, e.g., send a notification, update UI, etc.

    return newEvent;
  } catch (error) {
    console.error('Error creating calendar event', error);
    throw error;
  }
};

const updateCalendarEvent = async (eventId: number, CalendarBaseDTO: CalendarBaseDTO) => {
  try {
    const existingEvent = await findCalendarEventById(eventId);
    if (!existingEvent) {
      throw new Error('Calendar event not found');
    }

    const updatedEvent = await prisma.calendarRight.update({
      where: {
        id: eventId,
      },
      data: {
        userId: newEventData.userId,
        dutyName: newEventData.dutyName,
        date: newEventData.date,
        timeStart: newEventData.timeStart,
        timeEnd: newEventData.timeEnd,
      },
    });

    // Your logic here, e.g., send a notification, update UI, etc.

    return updatedEvent;
  } catch (error) {
    console.error('Error updating calendar event', error);
    throw error;
  }
};

const deleteCalendarEvent = async (eventId: number) => {
  try {
    const existingEvent = await findCalendarEventById(eventId);
    if (!existingEvent) {
      throw new Error('Calendar event not found');
    }

    await prisma.calendar.delete({
      where: {
        id: eventId,
      },
    });

    // Your logic here, e.g., send a notification, update UI, etc.

    return 0;
  } catch (error) {
    console.error('Error deleting calendar event', error);
    throw error;
  }
};

const findCalendarEventById = async (eventId: number) => {
  const event = await prisma.calendar.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error('Calendar event not found');
  }

  return event;
};

export default {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  findCalendarEventById,
};
