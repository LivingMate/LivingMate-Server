"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThisWeeksDuty = exports.updateCalendar = exports.showCalendar = exports.createSchedule = exports.createRepeatCalendar = exports.createCalendar = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const CalendarServiceUtils = __importStar(require("./CalendarServiceUtils"));
const UserService_1 = require("../UserService");
const GroupService_1 = require("../GroupService");
const message_1 = __importDefault(require("../../modules/message"));
// 주기 생성을 위한 서비스
const createRepeatCalendar = (userId, groupId, calendarCreateDto, recurrenceCount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdEvents = [];
        const startDate = new Date((0, dayjs_1.default)(calendarCreateDto.dateStart).format('YYYY-MM-DD'));
        const endDate = new Date((0, dayjs_1.default)(calendarCreateDto.dateEnd).format('YYYY-MM-DD'));
        for (let i = 0; i < recurrenceCount; i++) {
            const event = yield prisma.calendar.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    title: calendarCreateDto.title,
                    dateStart: new Date(startDate),
                    dateEnd: new Date(endDate),
                    timeStart: new Date((0, dayjs_1.default)(calendarCreateDto.timeStart).format('YYYY-MM-DD')),
                    timeEnd: new Date((0, dayjs_1.default)(calendarCreateDto.timeEnd).format('YYYY-MM-DD')),
                    term: calendarCreateDto.term,
                    memo: calendarCreateDto.memo || '',
                },
            });
            const data = {
                calendarId: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD'),
                dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD'),
                timeStart: (0, dayjs_1.default)(event.timeStart).format('HH:MM:SS'),
                timeEnd: (0, dayjs_1.default)(event.timeEnd).format('HH:MM:SS'),
                term: event.term,
                memo: event.memo,
            };
            createdEvents.push(data);
            switch (calendarCreateDto.term) {
                case 1: // 매일
                    startDate.setDate(startDate.getDate() + 1);
                    endDate.setDate(endDate.getDate() + 1);
                    break;
                case 2: // 매주
                    startDate.setDate(startDate.getDate() + 7);
                    endDate.setDate(endDate.getDate() + 7);
                    break;
                case 3: // 매달
                    startDate.setMonth(startDate.getMonth() + 1);
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case 4: // 매년
                    startDate.setFullYear(startDate.getFullYear() + 1);
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
                default:
                    break;
            }
        }
        return createdEvents;
    }
    catch (error) {
        console.error('error :: service/calendar/createRecurringCalendar', error);
        throw error;
    }
});
exports.createRepeatCalendar = createRepeatCalendar;
// 일정등록하는 부분(바로등록용)
const createCalendar = (userId, groupId, calendarCreateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, UserService_1.findUserById)(userId);
        const group = yield (0, GroupService_1.findGroupById)(groupId);
        yield (0, GroupService_1.checkForbiddenGroup)(user.groupId, groupId);
        let createdEvents = [];
        if (calendarCreateDto.term == 1) {
            // 매일
            createdEvents = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 30);
        }
        else if (calendarCreateDto.term == 2) {
            // 매주
            createdEvents = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 10);
        }
        else if (calendarCreateDto.term == 3) {
            // 매달
            createdEvents = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 10);
        }
        else if (calendarCreateDto.term == 4) {
            // 매년
            createdEvents = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 10);
        }
        else {
            // 주기 없을때
            const event = yield prisma.calendar.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    title: calendarCreateDto.title,
                    dateStart: new Date((0, dayjs_1.default)(calendarCreateDto.dateStart).format('YYYY-MM-DD')),
                    dateEnd: new Date((0, dayjs_1.default)(calendarCreateDto.dateEnd).format('YYYY-MM-DD')),
                    timeStart: new Date((0, dayjs_1.default)(calendarCreateDto.timeStart).format('YYYY-MM-DD')),
                    timeEnd: new Date((0, dayjs_1.default)(calendarCreateDto.timeEnd).format('YYYY-MM-DD')),
                    term: calendarCreateDto.term,
                    memo: calendarCreateDto.memo || '',
                },
            });
            const data = {
                calendarId: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD'),
                dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD'),
                timeStart: (0, dayjs_1.default)(event.timeStart).format('HH:MM:SS'),
                timeEnd: (0, dayjs_1.default)(event.timeEnd).format('HH:MM:SS'),
                term: event.term,
                memo: event.memo,
            };
            createdEvents.push(data);
        }
        return createdEvents;
    }
    catch (error) {
        console.error('error :: service/calendar/createCalendar', error);
        throw error;
    }
});
exports.createCalendar = createCalendar;
// 일정 조율 등록1
// 제목만 받는것
const createSchedule = (groupId, scheduleCreateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield (0, GroupService_1.findGroupById)(groupId);
        // await checkExistSchedule(scheduleCreateDto.scheduleId)
        // 존재하는 스케줄인지 확인하려는거였는데 에러 발생 -> 수정 필요
        const event = yield prisma.scheduling.create({
            data: {
                groupId: groupId,
                title: scheduleCreateDto.title,
                used: scheduleCreateDto.used,
            },
        });
        const data = {
            scheduleId: event.id,
            groupId: event.groupId,
            title: event.title,
            used: event.used,
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/calendar/createSchedule', error);
        throw error;
    }
});
exports.createSchedule = createSchedule;
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
const showCalendar = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calendarEvents = yield prisma.calendar.findMany({
            take: 10000000,
            where: {
                groupId: groupId,
            },
        });
        return calendarEvents;
    }
    catch (error) {
        console.error('error :: service/calendar/showCalendar', error);
        throw error;
    }
});
exports.showCalendar = showCalendar;
// 일정 update
const updateCalendar = (eventId, calendarUpdateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEvent = yield CalendarServiceUtils.findCalendarEventById(eventId);
        if (!existingEvent) {
            throw new Error(message_1.default.NOT_FOUND_CAL);
        }
        // Case 1: Term이 없는 이벤트를 Term이 생긴 이벤트(매일, 매주, 매달, 매년)로 수정
        if (!existingEvent.term && calendarUpdateDto.term) {
            // 기존 이벤트 삭제
            yield prisma.calendar.delete({
                where: {
                    id: eventId,
                },
            });
            let createdEvents = [];
            // 반복 이벤트 생성
            if (calendarUpdateDto.term == 1) {
                // 매일
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(calendarUpdateDto.userId, calendarUpdateDto.groupId, calendarUpdateDto, 30);
            }
            else if (calendarUpdateDto.term == 2) {
                // 매주
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(calendarUpdateDto.userId, calendarUpdateDto.groupId, calendarUpdateDto, 10);
            }
            else if (calendarUpdateDto.term == 3) {
                // 매달
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(calendarUpdateDto.userId, calendarUpdateDto.groupId, calendarUpdateDto, 10);
            }
            else if (calendarUpdateDto.term == 4) {
                // 매년
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(calendarUpdateDto.userId, calendarUpdateDto.groupId, calendarUpdateDto, 10);
            }
            return createdEvents;
        }
        // Case 2: term이 있는 이벤트를 term이 없는 이벤트로 수정하는 경우
        if (existingEvent.term && !calendarUpdateDto.term) {
            const deletedEvents = yield CalendarServiceUtils.deleteRepeatCalendar(eventId, existingEvent.term, existingEvent.userId, existingEvent.groupId, existingEvent.title, existingEvent.memo || '');
            return deletedEvents;
        }
        // Case 3: 그 외의 경우, 단순히 업데이트 수행
        const updatedEvent = yield prisma.calendar.update({
            where: {
                id: eventId,
            },
            data: {
                title: calendarUpdateDto.title,
                dateStart: calendarUpdateDto.dateStart,
                dateEnd: calendarUpdateDto.dateEnd,
                timeStart: calendarUpdateDto.timeStart,
                timeEnd: calendarUpdateDto.timeEnd,
                term: calendarUpdateDto.term,
                memo: calendarUpdateDto.memo,
            },
        });
        return updatedEvent;
    }
    catch (error) {
        console.error('error :: service/calendar/updateCalendar', error);
        throw error;
    }
});
exports.updateCalendar = updateCalendar;
// 일정 삭제
// const deleteCalendar = async (eventId: number) => {
//   try {
//     const existingEvent = await findCalendarEventById(eventId)
//     if (!existingEvent) {
//       throw new Error(message.NOT_FOUND_CAL)
//     }
//     await prisma.calendar.delete({
//       where: {
//         id: eventId,
//       },
//     })
//     return 0
//   } catch (error) {
//     console.error('error :: service/calendar/deleteCalendar', error)
//     throw error
//   }
// }
// 이번주 날짜의 일정 반환
const getThisWeeksDuty = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the start and end dates of the current week
        const { startDate, endDate } = CalendarServiceUtils.getCurrentWeekDates();
        // Get all calendar events for the group within the current week
        const calendarEventsThisWeek = yield prisma.calendar.findMany({
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
    }
    catch (error) {
        console.error("Error searching this week's duty", error);
        throw error;
    }
});
exports.getThisWeeksDuty = getThisWeeksDuty;
//# sourceMappingURL=CalendarService.js.map