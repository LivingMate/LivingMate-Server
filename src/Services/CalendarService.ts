import { PrismaClient, Scheduling } from '@prisma/client'
const prisma = new PrismaClient()
import { CalendarBaseDto } from '../DTOs/Calendar/CalendarBaseDto'
import { CalendarRightCreateDto } from '../DTOs/Calendar/Request/CalendarRightCreateDto'
import { ScheduleReadyCreateDto } from '../DTOs/Calendar/Request/ScheduleReadyCreateDto'
import { SchedulingCreateDto } from '../DTOs/Calendar/Request/SchedulingCreateDto'
import { differenceInDays, startOfWeek, endOfWeek } from 'date-fns'


// Id로 반환
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


// 바로 등록 생성 // 스케줄링 끝내고 일정 생성할때도 이거 쓰기
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
    const schedules:Scheduling[] = []

    // Iterate over the date range and create a schedule for each day
    for (let i = 0; i <= daysDifference; i++) {
      const currentDate = new Date(calendarData.dateStart)
      currentDate.setDate(currentDate.getDate() + i)

      const newScheduling:Scheduling = await prisma.scheduling.create({
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



// 일정 보여주기
const showCalendar = async (groupId: string) => {
  try {
    const calendarEvents = await prisma.calendar.findMany({
      take: 1000,
      where: {
        groupId: groupId,
      },
    });
    return calendarEvents;
  } catch (error) {
    console.error('Error retrieving calendar events', error);
    throw error;
  }
};


// 일정 수정
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


// 일정 삭제
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


// 이번주 날짜 반환
const getCurrentWeekDates = () => {
  const currentDate = new Date();
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Assuming Monday is the start of the week
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  return { startDate, endDate };
};


// 이번주 날짜로 일정 반환
const searchThisWeeksDuty = async (groupId: string) => {
  try {
    // Get the start and end dates of the current week
    const { startDate, endDate } = getCurrentWeekDates();

    // Get all calendar events for the group within the current week
    const calendarEventsThisWeek = await prisma.calendar.findMany({
      where: {
        groupId: groupId,
        dateStart: {
          gte: startDate,
        },
        dateEnd: {
          lte: endDate,
        },
      },
    });

    return calendarEventsThisWeek;
  } catch (error) {
    console.error('Error searching this week\'s duty', error);
    throw error;
  }
};



export {
  findCalendarEventById,
  createCalendar,
  createScheduleReady,
  createScheduling,
  showCalendar,
  updateCalendar,
  deleteCalendar,
  getCurrentWeekDates,
  searchThisWeeksDuty,
}
