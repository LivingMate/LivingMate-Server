import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { CalendarBaseDto } from '../../DTOs/Calendar/CalendarBaseDto'
import { CalendarRightCreateDto } from '../../DTOs/Calendar/Request/CalendarRightCreateDto'
import { ScheduleReadyCreateDto } from '../../DTOs/Calendar/Request/ScheduleReadyCreateDto'
import { SchedulingCreateDto } from '../../DTOs/Calendar/Request/SchedulingCreateDto'
// 이 파일 아직 미완성임! 천천히 해볼게

// 바로 등록 생성
const createCalendar = async (calendarData: CalendarBaseDto|CalendarRightCreateDto) => {
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
    const newCalendar = await prisma.scheduleReady.create({
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
    return newCalendar
  } catch (error) {
    console.error('Error creating schedule-ready event', error)
    throw error
  }
}

// 시간표 생성
const createScheduling = async (day: number, calendarData: SchedulingCreateDto) => {
  try {



    const newCalendar = await prisma.scheduling.create({
      data: {
        userId: calendarData.userId,
        groupId: calendarData.groupId,
        day: calendarData,
        timeStart: calendarData.timeStart,
        timeEnd: calendarData.timeEnd,
      },
    })

    // Your logic here, e.g., send a notification, update UI, etc.
    return newCalendar
  } catch (error) {
    console.error('Error creating schedule-ready event', error)
    throw error
  }
}


