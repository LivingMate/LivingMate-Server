import { PrismaClient, Scheduling } from '@prisma/client'
const prisma = new PrismaClient()
import dayjs from 'dayjs'
import { CalendarUpdateDto } from '../../DTOs/Calendar/Request/CalendarUpdateDto'
import { CalendarUpdateResponseDto } from '../../DTOs/Calendar/Response/CalendarUpdateResponseDto'
import { differenceInDays, startOfWeek, endOfWeek } from 'date-fns'
import * as UserService from '../UserService'

const findCalendarEventById = async (eventId: number) => {
  try {
    const event = await prisma.calendar.findUnique({
      where: {
        id: eventId,
      },
    })

    return event
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/findCalendarEventById', error)
    throw error
  }
}

// 만약 반복 일정인 것이라면 여기에 그 일정에 대한 정보가 저장이 됨(반복 제거)
const makeCalendarEventExist = async (eventId: number) => {
  try {
    const exist = await prisma.calendar.findUnique({
      where: {
        id: eventId,
      },
    })

    if (exist) {
      const event = await prisma.existCalendar.create({
        data: {
          groupId: exist.groupId,
          title: exist.title,
          dateStart: exist.dateStart,
          term: exist.term,
        },
      })
      return event
    }
  } catch (error) {
    console.error('Error finding calendar event by ID', error)
    throw error
  }
}

// 스케줄이 존재하는지 확인
const checkExistSchedule = async (eventId: number) => {
  try {
    const event = await prisma.scheduling.findUnique({
      where: {
        id: eventId,
      },
    })
    if (event) {
      throw new Error('already made schedule')
    }
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/checkExistSchedule', error)
    throw error
  }
}

// 반복 일정 업뎃
const updateRepeatCalendar = async (
  userId: string,
  groupId: string,
  calendarUpdateDto: CalendarUpdateDto,
  recurrenceCount: number,
): Promise<CalendarUpdateResponseDto[]> => {
  try {
    const createdEvents: CalendarUpdateResponseDto[] = []

    const startDate = new Date(dayjs(calendarUpdateDto.dateStart).format('YYYY-MM-DD'))
    const endDate = new Date(dayjs(calendarUpdateDto.dateEnd).format('YYYY-MM-DD'))

    for (let i = 0; i < recurrenceCount; i++) {
      const event = await prisma.calendar.create({
        data: {
          userId: userId,
          groupId: groupId,
          title: calendarUpdateDto.title,
          dateStart: new Date(startDate),
          dateEnd: new Date(endDate),
          timeStart: new Date(dayjs(calendarUpdateDto.timeStart).format('YYYY-MM-DD')),
          timeEnd: new Date(dayjs(calendarUpdateDto.timeEnd).format('YYYY-MM-DD')),
          term: calendarUpdateDto.term,
          memo: calendarUpdateDto.memo || '',
        },
      })

      const resUserColor = await UserService.findUserColorByUserId(event.userId)
      const resUserName = await UserService.getUserNameByUserId(event.userId)

      const data: CalendarUpdateResponseDto = {
        calendarId: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        userColor : resUserColor,
        userName : resUserName,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD'),
        timeStart: dayjs(event.timeStart).format('HH:MM:SS'),
        timeEnd: dayjs(event.timeEnd).format('HH:MM:SS'),
        term: event.term,
        memo: event.memo,
      }

      createdEvents.push(data)

      switch (calendarUpdateDto.term) {
        case 1: // 매일
          startDate.setDate(startDate.getDate() + 1)
          endDate.setDate(endDate.getDate() + 1)
          break
        case 2: // 매주
          startDate.setDate(startDate.getDate() + 7)
          endDate.setDate(endDate.getDate() + 7)
          break
        case 3: // 매달
          startDate.setMonth(startDate.getMonth() + 1)
          endDate.setMonth(endDate.getMonth() + 1)
          break
        case 4: // 매년
          startDate.setFullYear(startDate.getFullYear() + 1)
          endDate.setFullYear(endDate.getFullYear() + 1)
          break
        default:
          break
      }
    }

    return createdEvents
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/updateRepeatCalendar', error)
    throw error
  }
}

// CalendarServiceUtils.deleteRepeatSchedules 함수 예시
// CalendarServiceUtils.deleteRepeatSchedules 함수 예시
const deleteRepeatCalendar = async (
  eventId: number,
  term: number,
  userId: string,
  groupId: string,
  title: string,
  memo: string,
): Promise<void> => {
  try {
    await prisma.calendar.deleteMany({
      where: {
        id: {
          gt: eventId,
        },
        term: term,
        userId: userId,
        groupId: groupId,
        title: title,
        memo: memo,
      },
    })
  } catch (error) {
    console.error('error :: service/calendar/calendarServiceUtil/deleteRepeatCalendar', error)
    throw error
  }
}

// 이번주 날짜 반환
const getCurrentWeekDates = () => {
  try {
    const currentDate = new Date()
    // 월요일을 시작 날짜로
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 })

    return { startDate, endDate }
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/getCurrentWeekDates', error)
    throw error
  }
}

export {
  findCalendarEventById,
  makeCalendarEventExist,
  checkExistSchedule,
  updateRepeatCalendar,
  deleteRepeatCalendar,
  getCurrentWeekDates,
}
