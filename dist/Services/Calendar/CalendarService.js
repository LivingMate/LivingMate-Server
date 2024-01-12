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
exports.getThisWeeksDuty = exports.deleteCalendar = exports.updateCalendar = exports.showCalendar = exports.createSchedule = exports.createRepeatCalendar = exports.createCalendar = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const CalendarServiceUtils = __importStar(require("./CalendarServiceUtils"));
const UserService = __importStar(require("../UserService"));
const GroupServiceUtils = __importStar(require("../Group/GroupServiceUtils"));
const message_1 = __importDefault(require("../../modules/message"));
// CREATE
// 주기 생성을 위한 서비스
const createRepeatCalendar = (userId, groupId, calendarCreateDto, recurrenceCount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdEvents = [];
        const startDate = new Date((0, dayjs_1.default)(calendarCreateDto.dateStart).format('YYYY-MM-DD HH:mm:ss'));
        const endDate = new Date((0, dayjs_1.default)(calendarCreateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss'));
        for (let i = 0; i < recurrenceCount; i++) {
            const event = yield prisma.calendar.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    title: calendarCreateDto.title,
                    dateStart: new Date(startDate),
                    dateEnd: new Date(endDate),
                    term: calendarCreateDto.term,
                    memo: calendarCreateDto.memo || '',
                },
            });
            yield CalendarServiceUtils.multipleParticipants(calendarCreateDto.participants, groupId, event.id);
            const resUserColor = yield UserService.findUserColorByUserId(event.userId);
            const resUserName = yield UserService.getUserNameByUserId(event.userId);
            const data = {
                calendarId: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                userColor: resUserColor,
                userName: resUserName,
                dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
                dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
                term: event.term,
                memo: event.memo,
                participants: yield CalendarServiceUtils.makeArray(event.id),
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
        const user = yield UserService.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(groupId);
        yield GroupServiceUtils.checkForbiddenGroup(user.groupId, groupId);
        let createdEvents = [];
        if (calendarCreateDto.term == 1) {
            // 매일
            const result = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 30);
            createdEvents = result || [];
        }
        else if (calendarCreateDto.term == 2) {
            // 매주
            const result = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 10);
            createdEvents = result || [];
        }
        else if (calendarCreateDto.term == 3) {
            // 매달
            const result = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 10);
            createdEvents = result || [];
        }
        else if (calendarCreateDto.term == 4) {
            // 매년
            const result = yield createRepeatCalendar(userId, groupId, calendarCreateDto, 10);
            createdEvents = result || [];
        }
        else {
            // 주기 없을때
            const event = yield prisma.calendar.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    title: calendarCreateDto.title,
                    dateStart: new Date((0, dayjs_1.default)(calendarCreateDto.dateStart).format('YYYY-MM-DD HH:mm:ss')),
                    dateEnd: new Date((0, dayjs_1.default)(calendarCreateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss')),
                    term: calendarCreateDto.term,
                    memo: calendarCreateDto.memo || '',
                },
            });
            yield CalendarServiceUtils.multipleParticipants(calendarCreateDto.participants, groupId, event.id);
            const resUserColor = yield UserService.findUserColorByUserId(event.userId);
            const resUserName = yield UserService.getUserNameByUserId(event.userId);
            const data = {
                calendarId: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                userColor: resUserColor,
                userName: resUserName,
                dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
                dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
                term: event.term,
                memo: event.memo,
                participants: yield CalendarServiceUtils.makeArray(event.id),
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
        const group = yield GroupServiceUtils.findGroupById(groupId);
        const event = yield prisma.schedule.create({
            data: {
                groupId: groupId,
                title: scheduleCreateDto.title,
                used: false,
            },
        });
        const data = {
            scheduleId: event.id,
            groupId: event.groupId,
            title: event.title,
            used: false,
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/calendar/createSchedule', error);
        throw error;
    }
});
exports.createSchedule = createSchedule;
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
const updateCalendar = (userId, groupId, eventId, calendarUpdateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(groupId);
        const existingEvent = yield CalendarServiceUtils.findCalendarEventById(eventId);
        if (!existingEvent) {
            throw new Error(message_1.default.NOT_FOUND_CAL);
        }
        // Case 1: Term이 없는 이벤트를 Term이 생긴 이벤트(매일, 매주, 매달, 매년)로 수정 (단독일정 -> 반복일정)
        if (!existingEvent.term && calendarUpdateDto.term) {
            // 기존 이벤트 삭제
            yield prisma.participant.deleteMany({
                where: {
                    calendarId: eventId,
                },
            });
            yield prisma.calendar.delete({
                where: {
                    id: eventId,
                },
            });
            let createdEvents = [];
            // 반복 이벤트 생성
            if (calendarUpdateDto.term == 1) {
                // 매일
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 30);
            }
            else if (calendarUpdateDto.term == 2) {
                // 매주
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10);
            }
            else if (calendarUpdateDto.term == 3) {
                // 매달
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10);
            }
            else if (calendarUpdateDto.term == 4) {
                // 매년
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10);
            }
            return createdEvents;
        }
        // Case 2: term이 있는 이벤트를 term이 없는 이벤트로 수정하는 경우 (반복일정 -> 단일 일정)
        // 반복일정의 첫번째부터 수정시 : 처음부터 다 지우고 처음 이벤트를 update
        // 반복일정의 중간부터 수정시 : 중간부터 지우고 그 이후 이벤트를 update
        if (existingEvent.term && !calendarUpdateDto.term) {
            yield CalendarServiceUtils.deleteRepeatCalendar(eventId, existingEvent.term, existingEvent.userId, existingEvent.groupId, existingEvent.title, existingEvent.memo || '');
            const updatedEvent2 = yield prisma.calendar.update({
                where: {
                    id: eventId,
                },
                data: {
                    title: calendarUpdateDto.title,
                    dateStart: new Date((0, dayjs_1.default)(calendarUpdateDto.dateStart).format('YYYY-MM-DD HH:mm:ss')),
                    dateEnd: new Date((0, dayjs_1.default)(calendarUpdateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss')),
                    term: calendarUpdateDto.term,
                    memo: calendarUpdateDto.memo,
                },
            });
            yield CalendarServiceUtils.multipleParticipants(calendarUpdateDto.participants, groupId, updatedEvent2.id);
            const UserName = yield UserService.getUserNameByUserId(userId);
            const UserColor = yield UserService.findUserColorByUserId(userId);
            const eventToReturn = {
                Id: eventId,
                userId: userId,
                groupId: groupId,
                title: updatedEvent2.title,
                userColor: UserColor,
                userName: UserName,
                dateStart: (0, dayjs_1.default)(updatedEvent2.dateStart).format('YYYY-MM-DD HH:mm:ss'),
                dateEnd: (0, dayjs_1.default)(updatedEvent2.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
                term: 0,
                memo: updatedEvent2.memo,
                participants: yield CalendarServiceUtils.makeArray(eventId),
            };
            return eventToReturn;
        }
        // Case 3: term이 있는 이벤트를 term이 있는 이벤트로 수정하는 경우 (반복일정 -> 반복일정)
        // 반복일정의 첫번째부터 수정시 : 처음부터 다 지우고 처음 이벤트를 update
        // 반복일정의 중간부터 수정시 : 중간부터 지우고 그 이후 이벤트를 update
        if (existingEvent.term && calendarUpdateDto.term) {
            yield CalendarServiceUtils.deleteRepeatCalendar(existingEvent.id, existingEvent.term, userId, groupId, existingEvent.title, existingEvent.memo);
            let createdEvents = [];
            // 반복 이벤트 생성
            if (calendarUpdateDto.term == 1) {
                // 매일
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 30);
            }
            else if (calendarUpdateDto.term == 2) {
                // 매주
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10);
            }
            else if (calendarUpdateDto.term == 3) {
                // 매달
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10);
            }
            else if (calendarUpdateDto.term == 4) {
                // 매년
                createdEvents = yield CalendarServiceUtils.updateRepeatCalendar(userId, groupId, calendarUpdateDto, 10);
            }
            return createdEvents;
        }
        // Case 4: 그 외의 경우(주기 없 -> 주기 없), 단순히 업데이트 수행 (단일 일정 -> 단일 일정)
        const updatedEvent = yield prisma.calendar.update({
            where: {
                id: eventId,
            },
            data: {
                title: calendarUpdateDto.title,
                dateStart: new Date((0, dayjs_1.default)(calendarUpdateDto.dateStart).format('YYYY-MM-DD HH:mm:ss')),
                dateEnd: new Date((0, dayjs_1.default)(calendarUpdateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss')),
                term: calendarUpdateDto.term,
                memo: calendarUpdateDto.memo,
            },
        });
        yield CalendarServiceUtils.multipleParticipants(calendarUpdateDto.participants, groupId, updatedEvent.id);
        const UserName = yield UserService.getUserNameByUserId(updatedEvent.userId);
        const UserColor = yield UserService.findUserColorByUserId(updatedEvent.userId);
        const eventToReturn = {
            Id: updatedEvent.id,
            userId: userId,
            groupId: groupId,
            title: updatedEvent.title,
            userColor: UserColor,
            userName: UserName,
            dateStart: (0, dayjs_1.default)(updatedEvent.dateStart).format('YYYY-MM-DD HH:mm:ss'),
            dateEnd: (0, dayjs_1.default)(updatedEvent.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
            term: updatedEvent.term,
            memo: updatedEvent.memo,
            participants: yield CalendarServiceUtils.makeArray(updatedEvent.id),
        };
        return eventToReturn;
    }
    catch (error) {
        console.error('error :: service/calendar/updateCalendar', error);
        throw error;
    }
});
exports.updateCalendar = updateCalendar;
// DELETE
// 일정 삭제
const deleteCalendar = (userId, groupId, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield GroupServiceUtils.findGroupById(groupId);
        const existingEvent = yield CalendarServiceUtils.findCalendarEventById(eventId);
        if (!existingEvent) {
            throw new Error(message_1.default.NOT_FOUND_CAL);
        }
        // case1 : 주기 o 일정 삭제
        // 클릭한 것 포함 ~ 끝까지 삭제됨
        // 처음 클릭 -> 처음부터 끝까지 & 중간 클릭 -> 중간부터 끝까지
        if (existingEvent.term != 0) {
            const deletedEvents = yield CalendarServiceUtils.deleteThisRepeatCalendar(eventId, existingEvent.term, userId, groupId, existingEvent.title, existingEvent.memo || '');
            return deletedEvents;
            // case2 : 주기 x 일정 삭제
        }
        else {
            yield prisma.participant.deleteMany({
                where: {
                    calendarId: eventId,
                },
            });
            yield prisma.calendar.delete({
                where: {
                    id: eventId,
                },
            });
            return 0;
        }
    }
    catch (error) {
        console.error('error :: service/calendar/deleteCalendar', error);
        throw error;
    }
});
exports.deleteCalendar = deleteCalendar;
// GET
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
const getThisWeeksDuty = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = CalendarServiceUtils.getCurrentWeekDates();
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
        const groupedEvents = yield CalendarServiceUtils.groupThisWeekEvents(calendarEventsThisWeek);
        const data = groupedEvents.map((group) => ({
            title: group.title,
            groupId: group.groupId,
            daysOfWeek: group.daysOfWeek,
            participants: group.participants,
        }));
        return data;
    }
    catch (error) {
        console.error("이번 주의 일정 검색 중 오류", error);
        throw error;
    }
});
exports.getThisWeeksDuty = getThisWeeksDuty;
//# sourceMappingURL=CalendarService.js.map