import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import dayjs from 'dayjs'
import { CalendarUpdateDto } from '../../DTOs/Calendar/Request/CalendarUpdateDto'
import { CalendarUpdateResponseDto } from '../../DTOs/Calendar/Response/CalendarUpdateResponseDto'
import { differenceInDays, startOfWeek, endOfWeek } from 'date-fns'
import * as UserService from '../UserService'
import { CalendarCreateDto } from '../../DTOs/Calendar/Request/CalendarCreateDto'
import message from '../../modules/message'

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

// 반복 일정 업뎃
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

      await multipleParticipants(calendarUpdateDto.participants, groupId, event.id)
      const resUserColor = await UserService.findUserColorByUserId(event.userId)
      const resUserName = await UserService.getUserNameByUserId(event.userId)

      const data: CalendarUpdateResponseDto = {
        Id: event.id,
        userId: event.userId,
        groupId: event.groupId,
        title: event.title,
        userColor : resUserColor,
        userName : resUserName,
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
    });

    // Step 2: 삭제할 calendarId에 해당하는 participant 삭제 및 개수 가져오기
    const deletedParticipants = await prisma.participant.deleteMany({
      where: {
        calendarId: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    });

    // Step 3: 실제 calendar 삭제 및 개수 가져오기
    const deletedCalendars = await prisma.calendar.deleteMany({
      where: {
        id: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    });

    // deletedCalendars와 deletedParticipants에 각각 몇 개가 삭제되었는지 정보가 들어있습니다.
    console.log(`Deleted ${deletedCalendars.count} calendars and ${deletedParticipants.count} participants.`);
  } catch (error) {
    console.error('error :: service/calendar/calendarServiceUtil/deleteRepeatCalendar', error);
    throw error;
  }
};


const deleteThisRepeatCalendar = async (
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
          gte: eventId,
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
    });

    // Step 2: 삭제할 calendarId에 해당하는 participant 삭제 및 개수 가져오기
    const deletedParticipants = await prisma.participant.deleteMany({
      where: {
        calendarId: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    });

    // Step 3: 실제 calendar 삭제 및 개수 가져오기
    const deletedCalendars = await prisma.calendar.deleteMany({
      where: {
        id: {
          in: calendarIdsToDelete.map((calendar) => calendar.id),
        },
      },
    });

    // deletedCalendars와 deletedParticipants에 각각 몇 개가 삭제되었는지 정보가 들어있습니다.
    console.log(`Deleted ${deletedCalendars.count} calendars and ${deletedParticipants.count} participants.`);
  } catch (error) {
    console.error('error :: service/calendar/calendarServiceUtil/deleteRepeatCalendar', error);
    throw error;
  }
};

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

// 날짜를 요일로 변환
const getDayOfWeek = (date: Date): string => {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
};

interface CalendarEvent {
    id: number;
    userId: string;
    groupId: string;
    title: string;
    dateStart: Date;
    dateEnd: Date;
    memo?: string;
    term: number;
    
}
interface ExtendedCalendarEvent extends CalendarEvent {
  daysOfWeek: string[];
  participants: string[];
}


const groupThisWeekEvents = async (events: CalendarEvent[]) => {
  const groupedEvents: Record<string, ExtendedCalendarEvent> = {};

  for (const event of events) {
    const key = `${event.title}-${event.memo || ''}-${event.groupId}`;
    if (!groupedEvents[key]) {
      const participants = await getParticipantsForEvent(event.id);
      const daysOfWeek: string[] = [getDayOfWeek(event.dateStart)]; // 배열로 변경
      groupedEvents[key] = { ...(event as ExtendedCalendarEvent), daysOfWeek, participants };
    } else {
      // 이미 있는 경우, daysOfWeek를 합친다.
      const existingGroup = groupedEvents[key];
      existingGroup.daysOfWeek.push(...getDayOfWeek(event.dateStart));
    }
  }

  return Object.values(groupedEvents);
};





//참여자가 여러명인 경우
const multipleParticipants = async (
  participants: string[],
  groupId: string,
  calendarId: number
) => {
  const num: number = participants.length;

  try {
    const existingEvent = await findParticipantEventById(calendarId)

    if (existingEvent) {
      await prisma.participant.deleteMany({
        where: {
          calendarId: calendarId,
        },
      });
    }

    const createdEvents = [];

    for (let i = 0; i < num; i++) {
      const event = await prisma.participant.create({
        data: {
          userId: participants[i],
          groupId: groupId,
          calendarId: calendarId,
        },
      });

      createdEvents.push(event);
    }

    return createdEvents;
  } catch (error) {
    console.error('Error creating participants array', error);
    throw error;
  }
};



// 이벤트에 대한 참가자 가져오기
const getParticipantsForEvent = async (eventId: number) => {
  const participants = await prisma.participant.findMany({
    where: {
      calendarId: eventId,
    },
    select: {
      userId: true,
    },
  });
  return participants.map((participant) => participant.userId);
};


// 참여자가 여러명인거를 수정할 경우
const updateParticipants = async (
  participants: string[],
  groupId: string,
  calendarId: number
) => {
  try {
    // 해당 calendarId를 가진 참가자 데이터 조회
    const existingParticipants = await prisma.participant.findMany({
      where: {
        calendarId: calendarId,
      },
    });

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
          });
        })
      );

      return createdParticipants;
    }

    // 이미 해당 calendarId를 가진 참가자 데이터가 있다면 업데이트
    await prisma.participant.deleteMany({
      where: {
        calendarId: calendarId,
      },
    });

    const updatedParticipants = await Promise.all(
      participants.map(async (userId) => {
        return prisma.participant.create({
          data: {
            userId: userId,
            groupId: groupId,
            calendarId: calendarId,
          },
        });
      })
    );

    return updatedParticipants;
  } catch (error) {
    console.error('Error updating participants array', error);
    throw error;
  }
};


// 참가자 각각을 배열로 합치기
const makeArray = async (
  calendarId: number
): Promise<string[]> => {
  try {
    let arr: string[] = [];

    const participants = await prisma.participant.findMany({
      where: {
        calendarId: calendarId,
      },
    });

    participants.forEach((participant) => {
      arr.push(participant.userId);
    });

    return arr; 
  } catch (error) {
    console.error('makeArray에서 오류 발생:', error);
    throw error;
  }
};




export {
  findCalendarEventById,
  findParticipantEventById,
  makeCalendarEventExist,
  checkExistSchedule,
  updateRepeatCalendar,
  deleteRepeatCalendar,
  deleteThisRepeatCalendar,
  getCurrentWeekDates,
  getDayOfWeek,
  groupThisWeekEvents,
  getParticipantsForEvent,
  multipleParticipants,
  updateParticipants,
  makeArray
}
