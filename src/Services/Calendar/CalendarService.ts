import { PrismaClient } from '@prisma/client'
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
import * as UserService from '../UserService'
import * as GroupServiceUtils from '../Group/GroupServiceUtils'
import message from '../../modules/message'
import { da } from 'date-fns/locale'
import { preloadStyle } from 'next/dist/server/app-render/entry-base'

// CREATE -------------------------------
// 주기 생성을 위한 서비스
const createRepeatCalendar = async (
  userId: string,
  groupId: string,
  calendarCreateDto: CalendarCreateDto,
  recurrenceCount: number,
) => {
  try {
    const createdEvents = []

    const startDate = new Date(dayjs(calendarCreateDto.dateStart).format('YYYY-MM-DD HH:mm:ss'))
    const endDate = new Date(dayjs(calendarCreateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss'))

    for (let i = 0; i < recurrenceCount; i++) {
      const event = await prisma.calendar.create({
        data: {
          userId: userId,
          groupId: groupId,
          title: calendarCreateDto.title,
          dateStart: new Date(startDate),
          dateEnd: new Date(endDate),
          term: calendarCreateDto.term,
          memo: calendarCreateDto.memo || '',
        },
      })

      await CalendarServiceUtils.multipleParticipants(calendarCreateDto.participants, groupId, event.id)
      const resUserColor = await UserService.findUserColorByUserId(event.userId)
      const resUserName = await UserService.getUserNameByUserId(event.userId)

      const data = {
        calendarId: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        userColor: resUserColor,
        userName: resUserName,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
        term: event.term,
        memo: event.memo,
        participants: await CalendarServiceUtils.makeArray(event.id),
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
const createCalendar = async (userId: string, groupId: string, calendarCreateDto: CalendarCreateDto) => {
  try {
    const user = await UserService.findUserById(userId)
    const group = await GroupServiceUtils.findGroupById(groupId)
    await GroupServiceUtils.checkForbiddenGroup(user.groupId, groupId)

    let createdEvents = []

    if (calendarCreateDto.term == 1) {
      // 매일
      const result = await createRepeatCalendar(userId, groupId, calendarCreateDto, 30)
      createdEvents = result || []
    } else if (calendarCreateDto.term == 2) {
      // 매주
      const result = await createRepeatCalendar(userId, groupId, calendarCreateDto, 10)
      createdEvents = result || []
    } else if (calendarCreateDto.term == 3) {
      // 매달
      const result = await createRepeatCalendar(userId, groupId, calendarCreateDto, 10)
      createdEvents = result || []
    } else if (calendarCreateDto.term == 4) {
      // 매년
      const result = await createRepeatCalendar(userId, groupId, calendarCreateDto, 10)
      createdEvents = result || []
    } else {
      // 주기 없을때
      const event = await prisma.calendar.create({
        data: {
          userId: userId,
          groupId: groupId,
          title: calendarCreateDto.title,
          dateStart: new Date(dayjs(calendarCreateDto.dateStart).format('YYYY-MM-DD HH:mm:ss')),
          dateEnd: new Date(dayjs(calendarCreateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss')),
          term: calendarCreateDto.term,
          memo: calendarCreateDto.memo || '',
        },
      })

      await CalendarServiceUtils.multipleParticipants(calendarCreateDto.participants, groupId, event.id)
      const resUserColor = await UserService.findUserColorByUserId(event.userId)
      const resUserName = await UserService.getUserNameByUserId(event.userId)

      const data = {
        calendarId: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        userColor: resUserColor,
        userName: resUserName,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
        term: event.term,
        memo: event.memo,
        participants: await CalendarServiceUtils.makeArray(event.id),
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
// 기본 정보만 받는것
const createSchedule = async (
  groupId: string,
  scheduleCreateDto: ScheduleCreateDto,
): Promise<ScheduleCreateResponseDto> => {
  try {
    const group = await GroupServiceUtils.findGroupById(groupId)
    const datesString = JSON.stringify(scheduleCreateDto.dates)

    const event = await prisma.schedule.create({
      data: {
        groupId: groupId,
        title: scheduleCreateDto.title,
        dates: datesString,
        startTime: scheduleCreateDto.startTime,
        endTime: scheduleCreateDto.endTime,
      },
    })

    const datesArray = JSON.parse(event.dates)

    const data: ScheduleCreateResponseDto = {
      scheduleId: event.id,
      groupId: event.groupId,
      title: event.title,
      dates: datesArray,
      startTime: event.startTime,
      endTime: event.endTime,
    }

    return data
  } catch (error) {
    console.error('error :: service/calendar/createSchedule', error)
    throw error
  }
}

// 일정 조율 등록2
// 자기 가능한 날짜 시간 받아오기
const createScheduling = async (
  groupId: string,
  scheduleId: number,
  schedulingArray: SchedulingCreateDto[],
): Promise<SchedulingCreateResponseDto[]> => {
  const responseData: SchedulingCreateResponseDto[] = []
  try {
    const group = await GroupServiceUtils.findGroupById(groupId)

    // existingEvent를 반복문 밖에서 한 번만 체크
    const existingEvent = await CalendarServiceUtils.findSchedulingEventById(scheduleId)
    if (existingEvent) {
      await prisma.scheduling.deleteMany({
        where: {
          scheduleId: scheduleId,
        },
      })
    }

    // 배열을 순회하며 각각의 일정 정보에 대해 처리
    for (let i = 0; i < schedulingArray.length; i++) {
      let schedulingCreateDto = schedulingArray[i]

      let selectedByString = JSON.stringify(schedulingCreateDto.selectedBy)

      let event = await prisma.scheduling.create({
        data: {
          groupId: groupId,
          scheduleId: scheduleId,
          date: schedulingCreateDto.date,
          time: schedulingCreateDto.time,
          selectedBy: selectedByString,
        },
      })

      const selectedByArray = JSON.parse(event.selectedBy)

      const data: SchedulingCreateResponseDto = {
        schedulingId: event.id,
        groupId: groupId,
        scheduleId: scheduleId,
        date: event.date,
        time: event.time,
        selectedBy: selectedByArray,
      }

      responseData.push(data)
    }

    return responseData
  } catch (error) {
    console.error('error :: service/calendar/createScheduling', error)
    throw error
  }
}

// PATCH -----------------------------
// 일정 update
const updateCalendar = async (
  userId: string,
  groupId: string,
  eventId: number,
  calendarUpdateDto: CalendarUpdateDto,
) => {
  try {
    const user = await UserService.findUserById(userId)
    const group = await GroupServiceUtils.findGroupById(groupId)
    const existingEvent = await CalendarServiceUtils.findCalendarEventById(eventId)

    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    // Case 1: Term이 없는 이벤트를 Term이 생긴 이벤트(매일, 매주, 매달, 매년)로 수정 (단독일정 -> 반복일정)
    if (!existingEvent.term && calendarUpdateDto.term) {
      // 기존 이벤트 삭제
      await prisma.participant.deleteMany({
        where: {
          calendarId: eventId,
        },
      })

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

    // Case 2: term이 있는 이벤트를 term이 없는 이벤트로 수정하는 경우 (반복일정 -> 단일 일정)
    // 반복일정의 첫번째부터 수정시 : 처음부터 다 지우고 처음 이벤트를 update
    // 반복일정의 중간부터 수정시 : 중간부터 지우고 그 이후 이벤트를 update
    if (existingEvent.term && !calendarUpdateDto.term) {
      await CalendarServiceUtils.deleteRepeatCalendar(
        eventId,
        existingEvent.term,
        existingEvent.userId,
        existingEvent.groupId,
        existingEvent.title,
        existingEvent.memo || '',
      )

      const updatedEvent2 = await prisma.calendar.update({
        where: {
          id: eventId,
        },
        data: {
          title: calendarUpdateDto.title,
          dateStart: new Date(dayjs(calendarUpdateDto.dateStart).format('YYYY-MM-DD HH:mm:ss')),
          dateEnd: new Date(dayjs(calendarUpdateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss')),
          term: calendarUpdateDto.term,
          memo: calendarUpdateDto.memo,
        },
      })

      await CalendarServiceUtils.multipleParticipants(calendarUpdateDto.participants, groupId, updatedEvent2.id)
      const UserName = await UserService.getUserNameByUserId(userId)
      const UserColor = await UserService.findUserColorByUserId(userId)

      const eventToReturn: CalendarUpdateResponseDto = {
        Id: eventId,
        userId: userId,
        groupId: groupId,
        title: updatedEvent2.title,
        userColor: UserColor,
        userName: UserName,
        dateStart: dayjs(updatedEvent2.dateStart).format('YYYY-MM-DD HH:mm:ss'),
        dateEnd: dayjs(updatedEvent2.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
        term: 0,
        memo: updatedEvent2.memo,
        participants: await CalendarServiceUtils.makeArray(eventId),
      }

      return eventToReturn
    }

    // Case 3: term이 있는 이벤트를 term이 있는 이벤트로 수정하는 경우 (반복일정 -> 반복일정)
    // 반복일정의 첫번째부터 수정시 : 처음부터 다 지우고 처음 이벤트를 update
    // 반복일정의 중간부터 수정시 : 중간부터 지우고 그 이후 이벤트를 update
    if (existingEvent.term && calendarUpdateDto.term) {
      await CalendarServiceUtils.deleteRepeatCalendar(
        existingEvent.id,
        existingEvent.term,
        userId,
        groupId,
        existingEvent.title,
        existingEvent.memo,
      )

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

    // Case 4: 그 외의 경우(주기 없 -> 주기 없), 단순히 업데이트 수행 (단일 일정 -> 단일 일정)
    const updatedEvent = await prisma.calendar.update({
      where: {
        id: eventId,
      },
      data: {
        title: calendarUpdateDto.title,
        dateStart: new Date(dayjs(calendarUpdateDto.dateStart).format('YYYY-MM-DD HH:mm:ss')),
        dateEnd: new Date(dayjs(calendarUpdateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss')),
        term: calendarUpdateDto.term,
        memo: calendarUpdateDto.memo,
      },
    })

    await CalendarServiceUtils.multipleParticipants(calendarUpdateDto.participants, groupId, updatedEvent.id)
    const UserName = await UserService.getUserNameByUserId(updatedEvent.userId)
    const UserColor = await UserService.findUserColorByUserId(updatedEvent.userId)

    const eventToReturn: CalendarUpdateResponseDto = {
      Id: updatedEvent.id,
      userId: userId,
      groupId: groupId,
      title: updatedEvent.title,
      userColor: UserColor,
      userName: UserName,
      dateStart: dayjs(updatedEvent.dateStart).format('YYYY-MM-DD HH:mm:ss'),
      dateEnd: dayjs(updatedEvent.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
      term: updatedEvent.term,
      memo: updatedEvent.memo,
      participants: await CalendarServiceUtils.makeArray(updatedEvent.id),
    }

    return eventToReturn
  } catch (error) {
    console.error('error :: service/calendar/updateCalendar', error)
    throw error
  }
}

// DELETE ------------------------------
// 일정 삭제
const deleteCalendar = async (userId: string, groupId: string, eventId: number) => {
  try {
    const group = await GroupServiceUtils.findGroupById(groupId)
    const existingEvent = await CalendarServiceUtils.findCalendarEventById(eventId)
    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    // case1 : 주기 o 일정 삭제
    // 클릭한 것 포함 ~ 끝까지 삭제됨
    // 처음 클릭 -> 처음부터 끝까지 & 중간 클릭 -> 중간부터 끝까지
    if (existingEvent.term != 0) {
      const deletedEvents = await CalendarServiceUtils.deleteThisRepeatCalendar(
        eventId,
        existingEvent.term,
        userId,
        groupId,
        existingEvent.title,
        existingEvent.memo || '',
      )
      return deletedEvents

      // case2 : 주기 x 일정 삭제
    } else {
      await prisma.participant.deleteMany({
        where: {
          calendarId: eventId,
        },
      })
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

// 스케줄과 스케줄링 삭제
const deleteSchedule = async (groupId: string, eventId: number) => {
  try {
    await prisma.scheduling.deleteMany({
      where: {
        groupId: groupId,
        scheduleId: eventId,
      },
    })
    await prisma.schedule.delete({
      where: {
        groupId: groupId,
        id: eventId,
      },
    })
    return 0
  } catch (error) {
    console.error('error :: service/schedule/deleteSchedule', error)
    throw error
  }
}

// GET --------------------------------------
// 일정 보여주기
const showCalendar = async (groupId: string) => {
  try {
    // 캘린더 이벤트 가져오기
    const calendarEvents = await prisma.calendar.findMany({
      take: 9999999,
      where: {
        groupId: groupId,
      },
    })

    // 각 이벤트에 대한 참여자 정보 가져오기
    const calendarEventsWithParticipants = await Promise.all(
      calendarEvents.map(async (event) => {
        const participants = await prisma.participant.findMany({
          where: {
            calendarId: event.id,
          },
          select: {
            userId: true,
          },
        })

        return {
          ...event,
          participants: participants.map((participant) => participant.userId),
        }
      }),
    )

    return calendarEventsWithParticipants
  } catch (error) {
    console.error('error :: service/calendar/showCalendarWithParticipants', error)
    throw error
  }
}

// 이번주 일정 보여주기
interface CalendarEvent {
  id: number
  userId: string
  groupId: string
  title: string
  dateStart: Date
  dateEnd: Date
  memo?: string
  term: number
  participants?: string[]
}

const getThisWeeksDuty = async (groupId: string) => {
  try {
    const { startDate, endDate } = CalendarServiceUtils.getCurrentWeekDates()

    const calendarEventsThisWeek: CalendarEvent[] = await prisma.calendar.findMany({
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

    const groupedEvents = await CalendarServiceUtils.groupThisWeekEvents(calendarEventsThisWeek)

    const data = groupedEvents.map((group) => ({
      title: group.title,
      groupId: group.groupId,
      daysOfWeek: group.daysOfWeek,
      participants: group.participants,
    }))

    return data
  } catch (error) {
    console.error('이번 주의 일정 검색 중 오류', error)
    throw error
  }
}

// 스케줄 보여주기
const showSchedule = async (groupId: string) => {
  try {
    const scheduleEvents = await prisma.schedule.findMany({
      take: 100,
      where: {
        groupId: groupId,
      },
      select: {
        id: true,
        groupId: true,
        title: true,
        dates: true,
        startTime: true,
        endTime: true,
      },
    })
    const scheduleEventsWithParsedDates = scheduleEvents.map(event => ({
      ...event,
      dates: JSON.parse(event.dates),
    }));

    return scheduleEventsWithParsedDates
  } catch (error) {
    console.error('스케줄 반환 오류', error)
    throw error
  }
}

// 스케줄링 보여주기
const showScheduling = async (groupId: string, scheduleId: number) => {
  try{
    const schedulingEvents = await prisma.scheduling.findMany({
      take: 100,
      where: {
        groupId: groupId,
        scheduleId: scheduleId
      },
      select: {
        id: true,
        groupId: true,
        date: true,
        time: true,
        selectedBy: true
      },
    });
    const schedulingEventsWithParsedSelectedBy = schedulingEvents.map(event => ({
      ...event,
      selectedBy: JSON.parse(event.selectedBy),
    }));
    
    return schedulingEventsWithParsedSelectedBy
  } catch (error) {
    console.error('스케줄링 반환 오류', error)
    throw error
  }
}

export {
  createCalendar,
  createRepeatCalendar,
  createSchedule,
  createScheduling,
  showCalendar,
  updateCalendar,
  deleteCalendar,
  deleteSchedule,
  getThisWeeksDuty,
  showSchedule,
  showScheduling
}
