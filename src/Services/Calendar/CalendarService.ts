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

// CREATE
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
// 제목만 받는것
const createSchedule = async (
  groupId: string,
  scheduleCreateDto: ScheduleCreateDto,
): Promise<ScheduleCreateResponseDto> => {
  try {
    const group = await GroupServiceUtils.findGroupById(groupId)

    const event = await prisma.schedule.create({
      data: {
        groupId: groupId,
        title: scheduleCreateDto.title,
        used: false,
      },
    })

    const data: ScheduleCreateResponseDto = {
      scheduleId: event.id,
      groupId: event.groupId,
      title: event.title,
      used: false,
    }

    return data
  } catch (error) {
    console.error('error :: service/calendar/createSchedule', error)
    throw error
  }
}

// // 일정 조율 등록2
// 자기 가능한 날짜 시간 선택쓰
// const createBossScheduling = async(
//   userId: string,
//   groupId: string,
//   scheduleId: number,
//   schedulingCreateDto : SchedulingCreateDto
// ) : Promise<SchedulingCreateResponseDto> => {
//   try {
//     const group = await GroupServiceUtils.findGroupById(groupId)

//     const existSchedule = await prisma.existSchedule.create({
//       data: {
//         groupId: groupId,
//         scheduleId: scheduleId,
//         optionDate: schedulingCreateDto.date,
//         optionTime: schedulingCreateDto.time
//       },
//     })

//     const availabelDay = await prisma.availableDay.create({
//       data: {
//         userId: userId,
//         scheduleId: scheduleId,
//         existScheduleId: existSchedule.id,

//       }
//     })

//     // const data: ScheduleCreateResponseDto = {
//     //   scheduleId: event.id,
//     //   groupId: event.groupId,
//     //   title: event.title,
//     //   used: false,
//     // }

//     return data
//   } catch (error) {
//     console.error('error :: service/calendar/createSchedule', error)
//     throw error
//   }
// }

// PATCH
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
        calendarId: eventId,
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
      calendarId: updatedEvent.id,
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

// DELETE
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

// GET
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

    const groupedEvents = groupEventsByTitleMemoGroupId(calendarEventsThisWeek);

    const data = groupedEvents.map((group) => ({
      title: group[0].title,
      memo: group[0].memo,
      groupId: group[0].groupId,
      daysOfWeek: group.map((event) => CalendarServiceUtils.getDayOfWeek(event.dateStart)),
    }));

    return data;
  } catch (error) {
    console.error("Error searching this week's duty", error)
    throw error
  }
}

const groupEventsByTitleMemoGroupId = (events) => {
  const groupedEvents = {};
  for (const event of events) {
    const key = `${event.title}-${event.memo || ''}-${event.groupId}`;
    if (!groupedEvents[key]) {
      groupedEvents[key] = [];
    }
    groupedEvents[key].push(event);
  }
  return Object.values(groupedEvents);
};

export {
  createCalendar,
  createRepeatCalendar,
  createSchedule,
  // createBossScheduling,
  showCalendar,
  updateCalendar,
  deleteCalendar,
  getThisWeeksDuty,
  groupEventsByTitleMemoGroupId
}
