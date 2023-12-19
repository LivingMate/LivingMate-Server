import { PrismaClient, Scheduling } from '@prisma/client'
const prisma = new PrismaClient()
import dayjs from 'dayjs';
import { CalendarCreateDto } from '../DTOs/Calendar/Request/CalendarCreateDto'
import { CalendarCreateResponseDto } from '../DTOs/Calendar/Response/CalendarCreateResponseDto';
import { ScheduleCreateDto } from '../DTOs/Calendar/Request/ScheduleCreateDto'
import { ScheduleCreateResponseDto } from '../DTOs/Calendar/Response/ScheduleCreateResponseDto';
import { SchedulingCreateDto } from '../DTOs/Calendar/Request/SchedulingCreateDto'
import { SchedulingCreateResponseDto } from '../DTOs/Calendar/Response/SchedulingCreateResponseDto';
import { checkForbiddenGroup } from './GroupService'
import { differenceInDays, startOfWeek, endOfWeek } from 'date-fns'
import message from '../modules/message'
import { CalendarUpdateDto } from '../DTOs/Calendar/Request/CalendarUpdateDto';

//---------utils-----------
// 유저 찾기
const findUserById = async(userId:string) => {
  const numericUserId = parseInt(userId, 10);

  const user = await prisma.calendar.findUnique({
    where:{
      id:numericUserId,
    },
  });

  if(!user){
    throw new Error(message.UNAUTHORIZED);
  }
  return user;
}

// 그룹 찾기
const findGroupById = async (groupId: string) => {
  const numericGroupId = parseInt(groupId, 10);

  const group = await prisma.calendar.findUnique({
    where: {
      id: numericGroupId,
    },
  });

  if (!group) {
    throw new Error(message.UNAUTHORIZED)
  }
}

// 일정 찾기
const findCalendarEventById = async (eventId: number) => {
  try {
    const event = await prisma.calendar.findUnique({
      where: {
        id: eventId,
      },
    })

    return event
  } catch (error) {
    console.error('error :: service/calendar/findCalendarEventById', error)
    throw error
  }
}


// ------------real services-------------
// 바로 등록 생성 // 스케줄링 끝내고 일정 생성할때도 이거 쓰기
const createCalendar = async (
  userId: string, 
  groupId:string, 
  calendarCreateDto: CalendarCreateDto
  ):Promise<CalendarCreateResponseDto> => {
  try {
    const user = await findUserById(userId);
    const group = await findGroupById(groupId);
    await checkForbiddenGroup(user.groupId, groupId);

    const event = await prisma.calendar.create({
      data: {
        id: calendarCreateDto.calendarId,
        userId: userId,
        groupId: groupId,
        title: calendarCreateDto.dutyName,
        dateStart: new Date(dayjs(calendarCreateDto.dateStart).format('YYYY-MM-DD')),
        dateEnd: new Date(dayjs(calendarCreateDto.dateEnd).format('YYYY-MM-DD')),
        timeStart: new Date(dayjs(calendarCreateDto.timeStart).format('HH:mm:ss')),
        timeEnd: new Date(dayjs(calendarCreateDto.timeEnd).format('HH:mm:ss')),
        term: calendarCreateDto.routine,
        memo: calendarCreateDto.memo || '',
      },
    })

    const data: CalendarCreateResponseDto = {
        calendarId: event.id,
        userId: event.userId,
        groupId: event.groupId,
        dutyName: event.title,
        dateStart: dayjs(event.dateStart).format('YYYY-MM-DD'),
        dateEnd: dayjs(event.dateEnd).format('YYYY-MM-DD'),
        timeStart: dayjs(event.timeStart).format('HH:mm:ss'), // String으로 변환
        timeEnd: dayjs(event.timeEnd).format('HH:mm:ss'),
        routine: event.term ?? 0,
        memo: event.memo,
    }
    return data;
  } catch (error) {
    console.error('error :: service/calendar/createCalendar', error)
    throw error
  }
}

// 일정 조율 생성
const createSchedule = async (
  userId: string, 
  groupId:string, 
  scheduleCreateDto: ScheduleCreateDto)
  :Promise<ScheduleCreateResponseDto> => {
    try {
      const user = await findUserById(userId);
      const group = await findGroupById(groupId);
      await checkForbiddenGroup(user.groupId, groupId);

      const event = await prisma.scheduleReady.create({
        data: {
          id: scheduleCreateDto.calendarId,
          userId: userId,
          groupId: groupId,
          title: scheduleCreateDto.dutyName,
          dateStart: new Date(dayjs(scheduleCreateDto.dateStart).format('YYYY-MM-DD')),
          dateEnd: new Date(dayjs(scheduleCreateDto.dateEnd).format('YYYY-MM-DD')),
          timeStart: new Date(dayjs(scheduleCreateDto.timeStart).format('HH:mm:ss')),
          timeEnd: new Date(dayjs(scheduleCreateDto.timeEnd).format('HH:mm:ss')),
        },
      })

      const data:ScheduleCreateResponseDto = {
        calendarId: event.id,
        dutyName: event.title,
        userId: event.userId,
        groupId: event.groupId,
        dateStart: event.dateStart,
        dateEnd: event.dateEnd,
        timeStart: dayjs(event.timeStart).format('HH:mm:ss'),
        timeEnd: dayjs(event.timeEnd).format('HH:mm:ss'),
      } 

      return data;
    } catch (error) {
      console.error('error :: service/calendar/createSchedule', error)
      throw error
    }
}

// 시간표 생성
const createScheduling = async (calendarData: SchedulingCreateDto) => {
  try {
    // dateStart랑 dateEnd 빼주기
    const daysDifference = differenceInDays(calendarData.dateEnd, calendarData.dateStart)

    // 배열 생성
    const schedules: Scheduling[] = []

    for (let i = 0; i <= daysDifference; i++) {
      const currentDate = new Date(calendarData.dateStart)
      currentDate.setDate(currentDate.getDate() + i)

      const newScheduling: Scheduling = await prisma.scheduling.create({
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
    console.error('error :: service/calendar/createScheduling', error)
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
    })
    return calendarEvents
  } catch (error) {
    console.error('error :: service/calendar/showCalendar', error)
    throw error
  }
}

// 일정 수정
const updateCalendar = async (eventId: number, calendarUpdateDto:CalendarUpdateDto) => {
  try {
    const existingEvent = await findCalendarEventById(eventId)
    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    const updatedEvent = await prisma.calendar.update({
      where: {
        id: eventId,
      },
      data: {
        title: calendarUpdateDto.dutyName,
        dateStart: calendarUpdateDto.dateStart,
        dateEnd: calendarUpdateDto.dateEnd,
        timeStart: calendarUpdateDto.timeStart,
        timeEnd: calendarUpdateDto.timeEnd,
        term: calendarUpdateDto.routine,
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
const deleteCalendar = async (eventId: number) => {
  try {
    const existingEvent = await findCalendarEventById(eventId)
    if (!existingEvent) {
      throw new Error(message.NOT_FOUND_CAL)
    }

    await prisma.calendar.delete({
      where: {
        id: eventId,
      },
    })
    return 0
  } catch (error) {
    console.error('error :: service/calendar/deleteCalendar', error)
    throw error
  }
}

// 이번주 날짜 반환
const getCurrentWeekDates = () => {
  try{
    const currentDate = new Date()
    // 월요일을 시작 날짜로
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 })

    return { startDate, endDate }
  } catch (error) {
    console.error('error :: service/calendar/getCurrentWeekDates', error)
    throw error
  }
}

// 이번주 날짜의 일정 반환
const getThisWeeksDuty = async (groupId: string) => {
  try {
    // Get the start and end dates of the current week
    const { startDate, endDate } = getCurrentWeekDates()

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
    })

    return calendarEventsThisWeek
  } catch (error) {
    console.error("Error searching this week's duty", error)
    throw error
  }
}

export {
  findUserById,
  findGroupById,
  findCalendarEventById,
  createCalendar,
  createSchedule,
  createScheduling,
  showCalendar,
  updateCalendar,
  deleteCalendar,
  getCurrentWeekDates,
  getThisWeeksDuty,
}
