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
exports.showScheduling = exports.showSchedule = exports.getThisWeeksDuty = exports.deleteSchedule = exports.deleteCalendar = exports.updateCalendar = exports.showCalendar = exports.createScheduling = exports.createSchedule = exports.createRepeatCalendar = exports.createCalendar = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const CalendarServiceUtils = __importStar(require("./CalendarServiceUtils"));
const UserServiceUtils = __importStar(require("../User/UserServiceUtils"));
const GroupServiceUtils = __importStar(require("../Group/GroupServiceUtils"));
const message_1 = __importDefault(require("../../modules/message"));
// CREATE -------------------------------
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
            const data = {
                calendarId: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                // userColor: resUserColor,
                // userName: resUserName,
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
        const resUserName = yield UserServiceUtils.getUserNameByUserId(userId);
        yield prisma.notification.create({
            data: {
                groupId: groupId,
                userId: userId,
                text: `${resUserName}가 반복 일정을 등록했습니다.`,
                isDelete: false,
            },
        });
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
        const user = yield UserServiceUtils.findUserById(userId);
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
            const resUserName = yield UserServiceUtils.getUserNameByUserId(event.userId);
            yield prisma.notification.create({
                data: {
                    groupId: groupId,
                    userId: userId,
                    text: `${resUserName}가 일정을 등록했습니다.`,
                    isDelete: false,
                },
            });
            yield CalendarServiceUtils.multipleParticipants(calendarCreateDto.participants, groupId, event.id);
            const data = {
                calendarId: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                // userColor: resUserColor,
                // userName: resUserName,
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
// 기본 정보만 받는것
const createSchedule = (groupId, userId, scheduleCreateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield GroupServiceUtils.findGroupById(groupId);
        const datesString = JSON.stringify(scheduleCreateDto.dates);
        const event = yield prisma.schedule.create({
            data: {
                groupId: groupId,
                title: scheduleCreateDto.title,
                dates: datesString,
                startTime: scheduleCreateDto.startTime,
                endTime: scheduleCreateDto.endTime,
            },
        });
        const resUserName = yield UserServiceUtils.getUserNameByUserId(userId);
        yield prisma.notification.create({
            data: {
                groupId: groupId,
                userId: userId,
                text: `${resUserName}가 일정 조율을 등록했습니다.`,
                isDelete: false,
            },
        });
        const datesArray = JSON.parse(event.dates);
        const data = {
            scheduleId: event.id,
            groupId: event.groupId,
            title: event.title,
            dates: datesArray,
            startTime: event.startTime,
            endTime: event.endTime,
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
// 자기 가능한 날짜 시간 받아오기
const createScheduling = (groupId, scheduleId, schedulingArray) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = [];
    try {
        const group = yield GroupServiceUtils.findGroupById(groupId);
        // existingEvent를 반복문 밖에서 한 번만 체크
        const existingEvent = yield CalendarServiceUtils.findSchedulingEventById(scheduleId);
        if (existingEvent) {
            yield prisma.scheduling.deleteMany({
                where: {
                    scheduleId: scheduleId,
                },
            });
        }
        // 배열을 순회하며 각각의 일정 정보에 대해 처리
        for (let i = 0; i < schedulingArray.length; i++) {
            let schedulingCreateDto = schedulingArray[i];
            let selectedByString = JSON.stringify(schedulingCreateDto.selectedBy);
            let event = yield prisma.scheduling.create({
                data: {
                    groupId: groupId,
                    scheduleId: scheduleId,
                    date: schedulingCreateDto.date,
                    time: schedulingCreateDto.time,
                    selectedBy: selectedByString,
                },
            });
            const selectedByArray = JSON.parse(event.selectedBy);
            const data = {
                schedulingId: event.id,
                groupId: groupId,
                scheduleId: scheduleId,
                date: event.date,
                time: event.time,
                selectedBy: selectedByArray,
            };
            responseData.push(data);
        }
        return responseData;
    }
    catch (error) {
        console.error('error :: service/calendar/createScheduling', error);
        throw error;
    }
});
exports.createScheduling = createScheduling;
// PATCH -----------------------------
// 일정 update
const updateCalendar = (userId, groupId, eventId, calendarUpdateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
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
            const UserName = yield UserServiceUtils.getUserNameByUserId(userId);
            const UserColor = yield UserServiceUtils.findUserColorByUserId(userId);
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
        const UserName = yield UserServiceUtils.getUserNameByUserId(updatedEvent.userId);
        const UserColor = yield UserServiceUtils.findUserColorByUserId(updatedEvent.userId);
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
// DELETE ------------------------------
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
// 스케줄과 스케줄링 삭제
const deleteSchedule = (groupId, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.scheduling.deleteMany({
            where: {
                groupId: groupId,
                scheduleId: eventId,
            },
        });
        yield prisma.schedule.delete({
            where: {
                groupId: groupId,
                id: eventId,
            },
        });
        return 0;
    }
    catch (error) {
        console.error('error :: service/schedule/deleteSchedule', error);
        throw error;
    }
});
exports.deleteSchedule = deleteSchedule;
// GET --------------------------------------
// 일정 보여주기
const showCalendar = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 캘린더 이벤트 가져오기
        const calendarEvents = yield prisma.calendar.findMany({
            take: 9999999,
            where: {
                groupId: groupId,
            },
        });
        // 각 이벤트에 대한 참여자 정보 가져오기
        const calendarEventsWithParticipants = yield Promise.all(calendarEvents.map((event) => __awaiter(void 0, void 0, void 0, function* () {
            const participants = yield prisma.participant.findMany({
                where: {
                    calendarId: event.id,
                },
                select: {
                    userId: true,
                },
            });
            return Object.assign(Object.assign({}, event), { participants: participants.map((participant) => participant.userId) });
        })));
        return calendarEventsWithParticipants;
    }
    catch (error) {
        console.error('error :: service/calendar/showCalendarWithParticipants', error);
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
        console.error('이번 주의 일정 검색 중 오류', error);
        throw error;
    }
});
exports.getThisWeeksDuty = getThisWeeksDuty;
// 스케줄 보여주기
const showSchedule = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduleEvents = yield prisma.schedule.findMany({
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
        });
        const scheduleEventsWithParsedDates = scheduleEvents.map((event) => (Object.assign(Object.assign({}, event), { dates: JSON.parse(event.dates) })));
        return scheduleEventsWithParsedDates;
    }
    catch (error) {
        console.error('스케줄 반환 오류', error);
        throw error;
    }
});
exports.showSchedule = showSchedule;
// 스케줄링 보여주기
const showScheduling = (groupId, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedulingEvents = yield prisma.scheduling.findMany({
            take: 100,
            where: {
                groupId: groupId,
                scheduleId: scheduleId,
            },
            select: {
                id: true,
                groupId: true,
                date: true,
                time: true,
                selectedBy: true,
            },
        });
        const schedulingEventsWithParsedSelectedBy = schedulingEvents.map((event) => (Object.assign(Object.assign({}, event), { selectedBy: JSON.parse(event.selectedBy) })));
        return schedulingEventsWithParsedSelectedBy;
    }
    catch (error) {
        console.error('스케줄링 반환 오류', error);
        throw error;
    }
});
exports.showScheduling = showScheduling;
//# sourceMappingURL=CalendarService.js.map