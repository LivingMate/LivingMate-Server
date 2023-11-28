import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { CalendarBaseDto } from '../DTOs/Calendar/CalendarBaseDto'
import { CalendarRightCreateDto } from '../DTOs/Calendar/Request/CalendarRightCreateDto'
import { ScheduleReadyCreateDto } from '../DTOs/Calendar/Request/ScheduleReadyCreateDto'
import { SchedulingCreateDto } from '../DTOs/Calendar/Request/SchedulingCreateDto'
import { differenceInDays } from 'date-fns'

// 바로 등록 생성
const createCalendar = async (calendarData: CalendarBaseDto | CalendarRightCreateDto) => {
  try {
    const newCalendar = await prisma.calendar.create({
      data: {
        userId: calendarData.userId,
        groupId: calendarData.groupId,
        title: calendarData.dutyName,
        dateStart: calendarData.dateStart,
        dateEnd: calendarData.dateEnd,
        timeStart: calendarData.timeStart,
        timeEnd: calendarData.timeEnd,
        memo: (calendarData as CalendarRightCreateDto).memo || ' ',
      },
    })

    // Your logic here, e.g., send a notification, update UI, etc.
    return newCalendar
  } catch (error) {
    console.error('Error creating calendar event', error)
    throw error
  }
}

// 일정 조율 생성
const createScheduleReady = async (calendarData: ScheduleReadyCreateDto) => {
  try {
    const newScheduleReady = await prisma.scheduleReady.create({
      data: {
        userId: calendarData.userId,
        groupId: calendarData.groupId,
        title: calendarData.dutyName,
        dateStart: calendarData.dateStart,
        dateEnd: calendarData.dateEnd,
        timeStart: calendarData.timeStart,
        timeEnd: calendarData.timeEnd,
      },
    })

    // Your logic here, e.g., send a notification, update UI, etc.
    return newScheduleReady
  } catch (error) {
    console.error('Error creating schedule-ready event', error)
    throw error
  }
}

// 시간표 생성
const createScheduling = async (calendarData: SchedulingCreateDto) => {
  try {
    // dateStart랑 dateEnd 빼주기
    const daysDifference = differenceInDays(calendarData.dateEnd, calendarData.dateStart)

    // 배열 생성
    const schedules = []

    // Iterate over the date range and create a schedule for each day
    for (let i = 0; i <= daysDifference; i++) {
      const currentDate = new Date(calendarData.dateStart)
      currentDate.setDate(currentDate.getDate() + i)

      const newScheduling = await prisma.scheduling.create({
        data: {
          userId: calendarData.userId,
          groupId: calendarData.groupId,
          day: i + 1,
          timeStart: calendarData.timeStart,
          timeEnd: calendarData.timeEnd,
        },
      })

      schedules.push(newScheduling)
    }
    return schedules
  } catch (error) {
    console.error('Error creating schedule-ready events', error)
    throw error
  }
}

const updateCalendar = async (eventId: number, updateData: CalendarBaseDto) => {
  try {
    const existingEvent = await findCalendarEventById(eventId)
    if (!existingEvent) {
      throw new Error('Calendar event not found')
    }

    const updatedEvent = await prisma.calendar.update({
      where: {
        id: eventId,
      },
      data: {
        userId: updateData.userId,
        title: updateData.dutyName,
        dateStart: updateData.dateStart,
        dateEnd: updateData.dateEnd,
        timeStart: updateData.timeStart,
        timeEnd: updateData.timeEnd,
      },
    })

    return updatedEvent
  } catch (error) {
    console.error('Error updating calendar event', error)
    throw error
  }
}

const deleteCalendar = async (eventId: number) => {
  try {
    const existingEvent = await findCalendarEventById(eventId)
    if (!existingEvent) {
      throw new Error('Calendar event not found')
    }

    await prisma.calendar.delete({
      where: {
        id: eventId,
      },
    })

    return 0
  } catch (error) {
    console.error('Error deleting calendar event', error)
    throw error
  }
}

const findCalendarEventById = async (eventId: number) => {
  try {
    const event = await prisma.calendar.findUnique({
      where: {
        id: eventId,
      },
    })

    return event
  } catch (error) {
    console.error('Error finding calendar event by ID', error)
    throw error
  }
}

const getCalendarEventsForGroup = async (groupId: string) => {
  try {
    const calendarGetEvents = await prisma.calendar.findMany({
      where: {
        groupId: groupId,
      },
    });
    return calendarGetEvents;
  } catch (error) {
    console.error('Error retrieving calendar events for group', error);
    throw error;
  }
};

const searchCalendarEventsByDateRange = async ( dateStart: Date, dateEnd: Date) => {
  try {
    const calendarSearchEvents = await prisma.calendar.findMany({
      where: {
        dateStart: {
          gte: dateStart,
        },
        dateEnd: {
          lte: dateEnd,
        },
      },
    });
    return calendarSearchEvents;
  } catch (error) {
    console.error('Error searching calendar events by date range', error);
    throw error;
  }
};


export default {
  createCalendar,
  createScheduleReady,
  createScheduling,
  updateCalendar,
  deleteCalendar,
  findCalendarEventById,
  getCalendarEventsForGroup,
  searchCalendarEventsByDateRange
}
