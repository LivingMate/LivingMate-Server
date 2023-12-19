"use strict";
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
exports.getThisWeeksDuty = exports.getCurrentWeekDates = exports.deleteCalendar = exports.updateCalendar = exports.showCalendar = exports.createScheduling = exports.createSchedule = exports.createCalendar = exports.findCalendarEventById = exports.findGroupById = exports.findUserById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const GroupService_1 = require("./GroupService");
const date_fns_1 = require("date-fns");
const message_1 = __importDefault(require("../modules/message"));
//---------utils-----------
// 유저 찾기
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const numericUserId = parseInt(userId, 10);
    const user = yield prisma.calendar.findUnique({
        where: {
            id: numericUserId,
        },
    });
    if (!user) {
        throw new Error(message_1.default.UNAUTHORIZED);
    }
    return user;
});
exports.findUserById = findUserById;
// 그룹 찾기
const findGroupById = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const numericGroupId = parseInt(groupId, 10);
    const group = yield prisma.calendar.findUnique({
        where: {
            id: numericGroupId,
        },
    });
    if (!group) {
        throw new Error(message_1.default.UNAUTHORIZED);
    }
    return group;
});
exports.findGroupById = findGroupById;
// 일정 찾기
const findCalendarEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.calendar.findUnique({
            where: {
                id: eventId,
            },
        });
        return event;
    }
    catch (error) {
        console.error('error :: service/calendar/findCalendarEventById', error);
        throw error;
    }
});
exports.findCalendarEventById = findCalendarEventById;
// ------------real services-------------
// 바로 등록 생성 // 스케줄링 끝내고 일정 생성할때도 이거 쓰기
const createCalendar = (userId, groupId, calendarCreateDto) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield findUserById(userId);
        const group = yield findGroupById(groupId);
        yield (0, GroupService_1.checkForbiddenGroup)(user.groupId, groupId);
        const event = yield prisma.calendar.create({
            data: {
                id: calendarCreateDto.calendarId,
                userId: userId,
                groupId: groupId,
                title: calendarCreateDto.dutyName,
                dateStart: new Date((0, dayjs_1.default)(calendarCreateDto.dateStart).format('YYYY-MM-DD')),
                dateEnd: new Date((0, dayjs_1.default)(calendarCreateDto.dateEnd).format('YYYY-MM-DD')),
                timeStart: new Date((0, dayjs_1.default)(calendarCreateDto.timeStart).format('HH:mm:ss')),
                timeEnd: new Date((0, dayjs_1.default)(calendarCreateDto.timeEnd).format('HH:mm:ss')),
                term: calendarCreateDto.routine,
                memo: calendarCreateDto.memo || '',
            },
        });
        const data = {
            calendarId: event.id,
            userId: event.userId,
            groupId: event.groupId,
            dutyName: event.title,
            dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD'),
            dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD'),
            timeStart: (0, dayjs_1.default)(event.timeStart).format('HH:mm:ss'), // String으로 변환
            timeEnd: (0, dayjs_1.default)(event.timeEnd).format('HH:mm:ss'),
            routine: (_a = event.term) !== null && _a !== void 0 ? _a : 0,
            memo: event.memo,
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/calendar/createCalendar', error);
        throw error;
    }
});
exports.createCalendar = createCalendar;
// 일정 조율 생성
const createSchedule = (userId, groupId, scheduleCreateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield findUserById(userId);
        const group = yield findGroupById(groupId);
        yield (0, GroupService_1.checkForbiddenGroup)(user.groupId, groupId);
        const event = yield prisma.scheduleReady.create({
            data: {
                id: scheduleCreateDto.calendarId,
                userId: userId,
                groupId: groupId,
                title: scheduleCreateDto.dutyName,
                dateStart: new Date((0, dayjs_1.default)(scheduleCreateDto.dateStart).format('YYYY-MM-DD')),
                dateEnd: new Date((0, dayjs_1.default)(scheduleCreateDto.dateEnd).format('YYYY-MM-DD')),
                timeStart: new Date((0, dayjs_1.default)(scheduleCreateDto.timeStart).format('HH:mm:ss')),
                timeEnd: new Date((0, dayjs_1.default)(scheduleCreateDto.timeEnd).format('HH:mm:ss')),
            },
        });
        const data = {
            calendarId: event.id,
            dutyName: event.title,
            userId: event.userId,
            groupId: event.groupId,
            dateStart: event.dateStart,
            dateEnd: event.dateEnd,
            timeStart: (0, dayjs_1.default)(event.timeStart).format('HH:mm:ss'),
            timeEnd: (0, dayjs_1.default)(event.timeEnd).format('HH:mm:ss'),
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/calendar/createSchedule', error);
        throw error;
    }
});
exports.createSchedule = createSchedule;
// 시간표 생성
const createScheduling = (calendarData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // dateStart랑 dateEnd 빼주기
        const daysDifference = (0, date_fns_1.differenceInDays)(calendarData.dateEnd, calendarData.dateStart);
        // 배열 생성
        const schedules = [];
        for (let i = 0; i <= daysDifference; i++) {
            const currentDate = new Date(calendarData.dateStart);
            currentDate.setDate(currentDate.getDate() + i);
            const newScheduling = yield prisma.scheduling.create({
                data: {
                    userId: calendarData.userId,
                    groupId: calendarData.groupId,
                    day: i + 1,
                    timeStart: calendarData.timeStart,
                    timeEnd: calendarData.timeEnd,
                },
            });
            schedules.push(newScheduling);
        }
        return schedules;
    }
    catch (error) {
        console.error('error :: service/calendar/createScheduling', error);
        throw error;
    }
});
exports.createScheduling = createScheduling;
// 일정 보여주기
const showCalendar = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calendarEvents = yield prisma.calendar.findMany({
            take: 1000,
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
// 일정 수정
const updateCalendar = (eventId, calendarUpdateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEvent = yield findCalendarEventById(eventId);
        if (!existingEvent) {
            throw new Error(message_1.default.NOT_FOUND_CAL);
        }
        const updatedEvent = yield prisma.calendar.update({
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
const deleteCalendar = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEvent = yield findCalendarEventById(eventId);
        if (!existingEvent) {
            throw new Error(message_1.default.NOT_FOUND_CAL);
        }
        yield prisma.calendar.delete({
            where: {
                id: eventId,
            },
        });
        return 0;
    }
    catch (error) {
        console.error('error :: service/calendar/deleteCalendar', error);
        throw error;
    }
});
exports.deleteCalendar = deleteCalendar;
// 이번주 날짜 반환
const getCurrentWeekDates = () => {
    try {
        const currentDate = new Date();
        // 월요일을 시작 날짜로
        const startDate = (0, date_fns_1.startOfWeek)(currentDate, { weekStartsOn: 1 });
        const endDate = (0, date_fns_1.endOfWeek)(currentDate, { weekStartsOn: 1 });
        return { startDate, endDate };
    }
    catch (error) {
        console.error('error :: service/calendar/getCurrentWeekDates', error);
        throw error;
    }
};
exports.getCurrentWeekDates = getCurrentWeekDates;
// 이번주 날짜의 일정 반환
const getThisWeeksDuty = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the start and end dates of the current week
        const { startDate, endDate } = getCurrentWeekDates();
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