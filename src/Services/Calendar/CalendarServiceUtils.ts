import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import dayjs from 'dayjs'
import { CalendarUpdateDto } from '../../DTOs/Calendar/Request/CalendarUpdateDto'
import { ParticipantInfo } from '../../DTOs/Calendar/Request/CalendarCreateDto'
import { CalendarUpdateResponseDto } from '../../DTOs/Calendar/Response/CalendarUpdateResponseDto'
import { differenceInDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import * as UserServiceUtils from '../User/UserServiceUtils'
import * as NotificationService from '../NotificationService'
import { CalendarCreateDto } from '../../DTOs/Calendar/Request/CalendarCreateDto'
import message from '../../modules/message'

// 캘린더Id로 레코드 갖고오기
const findCalendarEventById = async (calendarId: number) => {
  try {
    const event = await prisma.calendar.findUnique({
      where: {
        id: calendarId,
      },
    })

    return event
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/findCalendarEventById', error)
    throw error
  }
}

// 일정조율1 ID로 일정조율2에 해당하는 타임슬럿들 갖고오기
const findSchedulingEventById = async (eventId: number) => {
  try {
    const event = await prisma.scheduling.findMany({
      where: {
        scheduleId: eventId,
      },
    })

    return event
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/findSchedulingEventById', error)
    throw error
  }
}

// 캘린더 Id로 해당하는 participants들 받아오기
const findParticipantEventById = async (eventId: number) => {
  try {
    const event = await prisma.participant.findMany({
      where: {
        calendarId: eventId,
      },
    })

    return event
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/findParticipantEventById', error)
    throw error
  }
}

// 스케줄이 존재하는지 확인
const checkExistSchedule = async (eventId: number) => {
  try {
    const event = await prisma.schedule.findUnique({
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

// 반복 일정 생성 유틸
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

      await multipleParticipants(calendarCreateDto.participants, groupId, event.id)

      const data = {
        calendarId: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
        term: event.term,
        memo: event.memo,
        participants: await makeArray(event.id),
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

    // 알림 생성
    await NotificationService.makeNotification(groupId, userId, 'createRepeatCalendar')

    return createdEvents
  } catch (error) {
    console.error('error :: service/calendar/createRecurringCalendar', error)
    throw error
  }
}

// 반복 일정 업뎃 유틸
const updateRepeatCalendar = async (
  userId: string,
  groupId: string,
  calendarUpdateDto: CalendarUpdateDto,
  recurrenceCount: number,
): Promise<CalendarUpdateResponseDto[]> => {
  try {
    const createdEvents: CalendarUpdateResponseDto[] = []

    const startDate = new Date(dayjs(calendarUpdateDto.dateStart).format('YYYY-MM-DD HH:mm:ss'))
    const endDate = new Date(dayjs(calendarUpdateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss'))

    for (let i = 0; i < recurrenceCount; i++) {
      const event = await prisma.calendar.create({
        data: {
          userId: userId,
          groupId: groupId,
          title: calendarUpdateDto.title,
          dateStart: new Date(startDate),
          dateEnd: new Date(endDate),
          term: calendarUpdateDto.term,
          memo: calendarUpdateDto.memo || '',
        },
      })

      // const participantUserIds: ParticipantInfo[] = (await makeArray(event.id));
      await multipleParticipants(calendarUpdateDto.participants, groupId, event.id)

      const data = {
        Id: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
        term: event.term,
        memo: event.memo,
        participants: await makeArray(event.id),
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

// 반복 일정 '업뎃'에 사용되는 삭제 유틸
const deleteRepeatCalendar = async (
  eventId: number,
  term: number,
  userId: string,
  groupId: string,
  title: string,
  memo: string,
): Promise<void> => {
  try {
    // Step 1: 삭제할 calendarId 조회
    const calendarIdsToDelete = await prisma.calendar.findMany({
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
      select: {
        id: true,
      },
    })

    // Step 2: 삭제할 calendarId에 해당하는 participant 삭제 및 개수 가져오기
    const deletedParticipants = await prisma.participant.deleteMany({
      where: {
        calendarId: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    })

    // Step 3: 실제 calendar 삭제 및 개수 가져오기
    const deletedCalendars = await prisma.calendar.deleteMany({
      where: {
        id: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    })

    console.log(`Deleted ${deletedCalendars.count} calendars and ${deletedParticipants.count} participants.`)
  } catch (error) {
    console.error('error :: service/calendar/calendarServiceUtil/deleteRepeatCalendar', error)
    throw error
  }
}

// 반복 일정 '삭제'에 사용되는 삭제 유틸
const deleteThisRepeatCalendar = async (
  calendarId: number,
  term: number,
  userId: string,
  groupId: string,
  title: string,
  memo: string,
): Promise<void> => {
  try {
    // Step 1: 삭제할 calendarId 조회
    const calendarIdsToDelete = await prisma.calendar.findMany({
      where: {
        id: {
          gte: calendarId,
        },
        term: term,
        userId: userId,
        groupId: groupId,
        title: title,
        memo: memo,
      },
      select: {
        id: true,
      },
    })

    // Step 2: 삭제할 calendarId에 해당하는 participant 삭제 및 개수 가져오기
    const deletedParticipants = await prisma.participant.deleteMany({
      where: {
        calendarId: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    })

    // Step 3: 실제 calendar 삭제 및 개수 가져오기
    const deletedCalendars = await prisma.calendar.deleteMany({
      where: {
        id: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    })

    // deletedCalendars와 deletedParticipants에 각각 몇 개가 삭제되었는지 정보가 들어있습니다.
    console.log(`Deleted ${deletedCalendars.count} calendars and ${deletedParticipants.count} participants.`)
  } catch (error) {
    console.error('error :: service/calendar/calendarServiceUtil/deleteRepeatCalendar', error)
    throw error
  }
}

// 이번주 날짜 반환
const getCurrentWeekDates = () => {
  try {
    const currentDate = new Date()

    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 })

    return { startDate, endDate }
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/getCurrentWeekDates', error)
    throw error
  }
}

// 이번달 날짜 반환
const getCurrentMonthDates = () => {
  try {
    const currentDate = new Date()

    const startDate = startOfMonth(currentDate)
    const endDate = endOfMonth(currentDate)

    return { startDate, endDate }
  } catch (error) {
    console.error('error :: service/calendar/CalendarServiceUtils/getCurrentMonthDates', error)
    throw error
  }
}

// 날짜를 요일로 변환
const getDayOfWeek = (date: Date): string => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
  const dayIndex = date.getDay()
  return daysOfWeek[dayIndex]
}

interface CalendarEvent {
  id: number
  userId: string
  groupId: string
  title: string
  dateStart: Date
  dateEnd: Date
  memo?: string
  term: number
}
interface ExtendedCalendarEvent extends CalendarEvent {
  daysOfWeek: string[]
  participants: string[]
}
// 반환될 이번주 일정 중 반복일정을 묶어주는 유틸
const groupThisWeekEvents = async (events: CalendarEvent[]) => {
  const groupedEvents: Record<string, ExtendedCalendarEvent> = {}

  for (const event of events) {
    const key = `${event.title}-${event.memo || ''}-${event.groupId}-${event.term}`
    if (!groupedEvents[key]) {
      const participants = await getParticipantsForEvent(event.id)
      const daysOfWeek: string[] = [getDayOfWeek(event.dateStart)] // 배열로 변경
      groupedEvents[key] = { ...(event as ExtendedCalendarEvent), daysOfWeek, participants }
    } else {
      // 이미 있는 경우, daysOfWeek를 합친다.
      const existingGroup = groupedEvents[key]
      existingGroup.daysOfWeek.push(...getDayOfWeek(event.dateStart))
    }
  }

  return Object.values(groupedEvents)
}

//참여자가 여러명인 경우
const multipleParticipants = async (participants: string[], groupId: string, calendarId: number) => {
  const num: number = participants.length

  try {
    const existingEvent = await findParticipantEventById(calendarId)

    if (existingEvent) {
      // Assuming you want to delete existing participants only, not the whole event
      await prisma.participant.deleteMany({
        where: {
          calendarId: calendarId,
        },
      })
    }

    const createdEvents = []

    for (let i = 0; i < num; i++) {
      const userId = participants[i]

      // Fetch additional participant information using getParticipantInfo service
      const participantInfo = await getParticipantInfo(userId)

      const event = await prisma.participant.create({
        data: {
          userId: userId,
          groupId: groupId,
          calendarId: calendarId,
        },
      })

      createdEvents.push({
        userId: userId,
        userName: participantInfo.userName,
        userColor: participantInfo.userColor,
      })
    }

    return createdEvents
  } catch (error) {
    console.error('Error creating participants array', error)
    throw error
  }
}

// 이벤트에 대한 참가자 가져오기
const getParticipantsForEvent = async (eventId: number) => {
  const participants = await prisma.participant.findMany({
    where: {
      calendarId: eventId,
    },
    select: {
      userId: true,
    },
  })
  return participants.map((participant) => participant.userId)
}

// 참여자가 여러명인거를 수정할 경우
const updateParticipants = async (participants: string[], groupId: string, calendarId: number) => {
  try {
    // 해당 calendarId를 가진 참가자 데이터 조회
    const existingParticipants = await prisma.participant.findMany({
      where: {
        calendarId: calendarId,
      },
    })

    // 만약 해당 calendarId를 가진 참가자 데이터가 없다면 생성
    if (existingParticipants.length === 0) {
      const createdParticipants = await Promise.all(
        participants.map(async (userId) => {
          return prisma.participant.create({
            data: {
              userId: userId,
              groupId: groupId,
              calendarId: calendarId,
            },
          })
        }),
      )

      return createdParticipants
    }

    // 이미 해당 calendarId를 가진 참가자 데이터가 있다면 업데이트
    await prisma.participant.deleteMany({
      where: {
        calendarId: calendarId,
      },
    })

    const updatedParticipants = await Promise.all(
      participants.map(async (userId) => {
        return prisma.participant.create({
          data: {
            userId: userId,
            groupId: groupId,
            calendarId: calendarId,
          },
        })
      }),
    )

    return updatedParticipants
  } catch (error) {
    console.error('Error updating participants array', error)
    throw error
  }
}

// 참가자 각각을 배열로 합치기
const makeArray = async (calendarId: number): Promise<ParticipantInfo[]> => {
  try {
    const participants = await prisma.participant.findMany({
      where: {
        calendarId: calendarId,
      },
    })

    const userIds = participants.map((participant) => participant.userId)

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        userColor: true,
        userName: true,
      },
    })

    const userMap = new Map(users.map((user) => [user.id, user]))

    const arr = participants.map((participant) => ({
      userId: participant.userId,
      userColor: userMap.get(participant.userId)?.userColor || '',
      userName: userMap.get(participant.userId)?.userName || '',
    }))

    return arr
  } catch (error) {
    console.error('makeArray에서 오류 발생:', error)
    throw error
  }
}

// 참여자의 Id로 이름과 색상 반환
const getParticipantInfo = async (userId: string): Promise<ParticipantInfo> => {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new Error(`User with ID ${userId} not found.`)
  }

  return {
    userId,
    userName: user.userName, // 여기서는 사용자의 이름 필드를 사용하도록 가정
    userColor: user.userColor, // 여기서는 사용자의 색상 필드를 사용하도록 가정
  }
}

export {
  findCalendarEventById,
  findSchedulingEventById,
  findParticipantEventById,
  //makeCalendarEventExist,
  checkExistSchedule,
  createRepeatCalendar,
  updateRepeatCalendar,
  deleteRepeatCalendar,
  deleteThisRepeatCalendar,
  getCurrentWeekDates,
  getCurrentMonthDates,
  getDayOfWeek,
  groupThisWeekEvents,
  getParticipantsForEvent,
  multipleParticipants,
  updateParticipants,
  makeArray,
  getParticipantInfo,
}
