import { PrismaClient, Scheduling } from '@prisma/client'
const prisma = new PrismaClient()
import dayjs from 'dayjs'
import * as CalendarServiceUtils from './CalendarServiceUtils'
import { CalendarCreateDto } from '../../DTOs/Calendar/Request/CalendarCreateDto'
import { CalendarCreateResponseDto } from '../../DTOs/Calendar/Response/CalendarCreateResponseDto'
import { ScheduleCreateDto } from '../../DTOs/Calendar/Request/ScheduleCreateDto'
import { ScheduleCreateResponseDto } from '../../DTOs/Calendar/Response/ScheduleCreateResponseDto'
import { CalendarUpdateDto } from '../../DTOs/Calendar/Request/CalendarUpdateDto'
import { CalendarUpdateResponseDto } from '../../DTOs/Calendar/Response/CalendarUpdateResponseDto'
import { SchedulingCreateDto } from '../../DTOs/Calendar/Request/SchedulingCreateDto'
import { SchedulingCreateResponseDto } from '../../DTOs/Calendar/Response/SchedulingCreateResponseDto'
import { findUserById } from '../UserService'
import { findGroupById, checkForbiddenGroup } from '../GroupService'
import { differenceInDays, startOfWeek, endOfWeek } from 'date-fns'
import message from '../../modules/message'

// 주기 생성을 위한 서비스
const createRepeatCalendar = async (
  userId: string,
  groupId: string,
  calendarCreateDto: CalendarCreateDto,
  recurrenceCount: number,
): Promise<CalendarCreateResponseDto[]> => {
  try {
    const createdEvents: CalendarCreateResponseDto[] = []

    const startDate = new Date(dayjs(calendarCreateDto.dateStart).format('YYYY-MM-DD'))
    const endDate = new Date(dayjs(calendarCreateDto.dateEnd).format('YYYY-MM-DD'))

    for (let i = 0; i < recurrenceCount; i++) {
      const event = await prisma.calendar.create({
        data: {
          userId: userId,
          groupId: groupId,
          title: calendarCreateDto.title,
          dateStart: new Date(startDate),
          dateEnd: new Date(endDate),
          timeStart: new Date(dayjs(calendarCreateDto.timeStart).format('YYYY-MM-DD')),
          timeEnd: new Date(dayjs(calendarCreateDto.timeEnd).format('YYYY-MM-DD')),
          term: calendarCreateDto.term,
          memo: calendarCreateDto.memo || '',
        },
      })

      const data: CalendarCreateResponseDto = {
        calendarId: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD'),
        timeStart: dayjs(event.timeStart).format('HH:MM:SS'),
        timeEnd: dayjs(event.timeEnd).format('HH:MM:SS'),
        term: event.term,
        memo: event.memo,
      }

      createdEvents.push(data)

      switch (calendarCreateDto.term) {
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
    console.error('error :: service/calendar/createRecurringCalendar', error)
    throw error
  }
}

// 일정등록하는 부분(바로등록용)
const createCalendar = async (
  userId: string,
  groupId: string,
  calendarCreateDto: CalendarCreateDto,
): Promise<CalendarCreateResponseDto[]> => {
  try {
    const user = await findUserById(userId)
    const group = await findGroupById(groupId)
    await checkForbiddenGroup(user.groupId, groupId)

    let createdEvents: CalendarCreateResponseDto[] = []

    if (calendarCreateDto.term == 1) {
      // 매일
      createdEvents = await createRepeatCalendar(userId, groupId, calendarCreateDto, 30)
    } else if (calendarCreateDto.term == 2) {
      // 매주
      createdEvents = await createRepeatCalendar(userId, groupId, calendarCreateDto, 10)
    } else if (calendarCreateDto.term == 3) {
      // 매달
      createdEvents = await createRepeatCalendar(userId, groupId, calendarCreateDto, 10)
    } else if (calendarCreateDto.term == 4) {
      // 매년
      createdEvents = await createRepeatCalendar(userId, groupId, calendarCreateDto, 10)
    } else {
      // 주기 없을때
      const event = await prisma.calendar.create({
        data: {
          userId: userId,
          groupId: groupId,
          title: calendarCreateDto.title,
          dateStart: new Date(dayjs(calendarCreateDto.dateStart).format('YYYY-MM-DD')),
          dateEnd: new Date(dayjs(calendarCreateDto.dateEnd).format('YYYY-MM-DD')),
          timeStart: new Date(dayjs(calendarCreateDto.timeStart).format('YYYY-MM-DD')),
          timeEnd: new Date(dayjs(calendarCreateDto.timeEnd).format('YYYY-MM-DD')),
          term: calendarCreateDto.term,
          memo: calendarCreateDto.memo || '',
        },
      })

      const data: CalendarCreateResponseDto = {
        calendarId: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD'),
        timeStart: dayjs(event.timeStart).format('HH:MM:SS'),
        timeEnd: dayjs(event.timeEnd).format('HH:MM:SS'),
        term: event.term,
        memo: event.memo,
      }

      createdEvents.push(data)
    }

    return createdEvents
  } catch (error) {
    console.error('error :: service/calendar/createCalendar', error)
    throw error
  }
}

// 일정 조율 등록1
// 제목만 받는것
const createSchedule = async (
  groupId: string,
  scheduleCreateDto: ScheduleCreateDto,
): Promise<ScheduleCreateResponseDto> => {
  try {
    const group = await findGroupById(groupId)
    // await checkExistSchedule(scheduleCreateDto.scheduleId)
    // 존재하는 스케줄인지 확인하려는거였는데 에러 발생 -> 수정 필요

    const event = await prisma.scheduling.create({
      data: {
        groupId: groupId,
        title: scheduleCreateDto.title,
        used: scheduleCreateDto.used,
      },
    })

    const data: ScheduleCreateResponseDto = {
      scheduleId: event.id,
      groupId: event.groupId,
      title: event.title,
      used: event.used,
    }

    return data
  } catch (error) {
    console.error('error :: service/calendar/createSchedule', error)
    throw error
  }
}

// 일정 조율 등록2
// 자기 가능한 날짜 시간 선택쓰
// const createScheduling = async(
//   userId: string,
//   groupId: string,
//   schedulingId: number,
//   SchedulingCreateDto : SchedulingCreateDto
// ) : Promise<SchedulingCreateResponseDto> => {

// }

// 일정 보여주기
const showCalendar = async (groupId: string) => {
  try {
    const calendarEvents = await prisma.calendar.findMany({
      take: 10000000,
      where: {
        groupId: groupId,
      },
    })
    return calendarEvents
  } catch (error) {
    console.error('error :: service/calendar/showCalendar', error)
    throw error
  }
}

// 일정 update
const updateCalendar = async (
  userId: string,
  groupId: string,
  eventId: number,
  calendarUpdateDto: CalendarUpdateDto,
) => {
  try {
    const user = await findUserById(userId)
    const group = await findGroupById(groupId)
    const existingEvent = await CalendarServiceUtils.findCalendarEventById(eventId)
    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    // Case 1: Term이 없는 이벤트를 Term이 생긴 이벤트(매일, 매주, 매달, 매년)로 수정
    if (!existingEvent.term && calendarUpdateDto.term) {
      // 기존 이벤트 삭제
      await prisma.calendar.delete({
        where: {
          id: eventId,
        },
      })

      let createdEvents: CalendarUpdateResponseDto[] = []
      // 반복 이벤트 생성
      if (calendarUpdateDto.term == 1) {
        // 매일
        createdEvents = await CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 30)
      } else if (calendarUpdateDto.term == 2) {
        // 매주
        createdEvents = await CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10)
      } else if (calendarUpdateDto.term == 3) {
        // 매달
        createdEvents = await CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10)
      } else if (calendarUpdateDto.term == 4) {
        // 매년
        createdEvents = await CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10)
      }
      return createdEvents
    }

    // Case 2: term이 있는 이벤트를 term이 없는 이벤트로 수정하는 경우
    if (existingEvent.term && !calendarUpdateDto.term) {
      const deletedEvents = await CalendarServiceUtils.deleteRepeatCalendar(
        eventId,
        existingEvent.term,
        existingEvent.userId,
        existingEvent.groupId,
        existingEvent.title,
        existingEvent.memo || '',
      )

      return deletedEvents
    }
    // Case 3: 그 외의 경우, 단순히 업데이트 수행
    const updatedEvent = await prisma.calendar.update({
      where: {
        id: eventId,
      },
      data: {
        title: calendarUpdateDto.title,
        dateStart: new Date(dayjs(calendarUpdateDto.dateStart).format('YYYY-MM-DD')),
        dateEnd: new Date(dayjs(calendarUpdateDto.dateEnd).format('YYYY-MM-DD')),
        timeStart: new Date(dayjs(calendarUpdateDto.timeStart).format('YYYY-MM-DD')),
        timeEnd: new Date(dayjs(calendarUpdateDto.timeEnd).format('YYYY-MM-DD')),
        term: calendarUpdateDto.term,
        memo: calendarUpdateDto.memo,
      },
    })

    return updatedEvent
  } catch (error) {
    console.error('error :: service/calendar/updateCalendar', error)
    throw error
  }
}

// 일정 삭제
const deleteCalendar = async (userId:string, groupId: string, eventId: number) => {
  try {
    const group = await findGroupById(groupId)
    const existingEvent = await CalendarServiceUtils.findCalendarEventById(eventId)
    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    if (existingEvent.term != 0) {
      const deletedEvents = await CalendarServiceUtils.deleteRepeatCalendar(
        eventId,
        existingEvent.term,
        existingEvent.userId,
        existingEvent.groupId,
        existingEvent.title,
        existingEvent.memo || '',
      )
      return deletedEvents
    } else {
      await prisma.calendar.delete({
        where: {
          id: eventId,
        },
      })
      return 0
    }
  } catch (error) {
    console.error('error :: service/calendar/deleteCalendar', error)
    throw error
  }
}

// 이번주 날짜의 일정 반환
const getThisWeeksDuty = async (groupId: string) => {
  try {
    const { startDate, endDate } = CalendarServiceUtils.getCurrentWeekDates()

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
    })

    return calendarEventsThisWeek
  } catch (error) {
    console.error("Error searching this week's duty", error)
    throw error
  }
}

export {
  createCalendar,
  createRepeatCalendar,
  createSchedule,
  // createScheduling,
  showCalendar,
  updateCalendar,
  deleteCalendar,
  getThisWeeksDuty,
}
