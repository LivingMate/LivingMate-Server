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
exports.searchThisWeeksDuty = exports.getCurrentWeekDates = exports.deleteCalendar = exports.updateCalendar = exports.showCalendar = exports.createScheduling = exports.createScheduleReady = exports.createCalendar = exports.findCalendarEventById = exports.findGroupById = exports.findUserById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const GroupService_1 = require("./GroupService");
const date_fns_1 = require("date-fns");
const message_1 = __importDefault(require("../modules/message"));
// 유저 반환
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
const findGroupById = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const numericGroupId = parseInt(groupId, 10);
    const group = yield prisma.calendar.findUnique({
        where: {
            groupId: numericGroupId,
        },
    });
    if (!group) {
        throw new Error(message_1.default.UNAUTHORIZED);
    }
});
exports.findGroupById = findGroupById;
// Id로 반환
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
        console.error('Error finding calendar event by ID', error);
        throw error;
    }
});
exports.findCalendarEventById = findCalendarEventById;
// 바로 등록 생성 // 스케줄링 끝내고 일정 생성할때도 이거 쓰기
const createCalendar = (userId, groupId, calendarCreateDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield findUserById(userId);
        const group = yield findGroupById(groupId);
        yield (0, GroupService_1.checkForbiddenGroup)(user.groupId, group);
        const event = yield prisma.calendar.create({
            data: {
                userId: userId,
                groupId: groupId,
                title: calendarCreateDto.dutyName,
                dateStart: new Date((0, dayjs_1.default)(calendarCreateDto.dateStart).format('YYYY-MM-DD')),
                dateEnd: new Date((0, dayjs_1.default)(calendarCreateDto.dateEnd).format('YYYY-MM-DD')),
                timeStart: new Date(calendarCreateDto.timeStart),
                timeEnd: new Date(calendarCreateDto.timeEnd),
                memo: calendarCreateDto.memo || '',
            },
        });
        const data = {
            userId: event.userId,
            groupId: event.groupId,
            title: event.title,
            dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD'),
            dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD'),
            timeStart: event.timeStart,
            timeEnd: event.timeEnd,
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
const createScheduleReady = (calendarData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newScheduleReady = yield prisma.scheduleReady.create({
            data: {
                userId: calendarData.userId,
                groupId: calendarData.groupId,
                title: calendarData.dutyName,
                dateStart: calendarData.dateStart,
                dateEnd: calendarData.dateEnd,
                timeStart: calendarData.timeStart,
                timeEnd: calendarData.timeEnd,
            },
        });
        // Your logic here, e.g., send a notification, update UI, etc.
        return newScheduleReady;
    }
    catch (error) {
        console.error('Error creating schedule-ready event', error);
        throw error;
    }
});
exports.createScheduleReady = createScheduleReady;
// 시간표 생성
const createScheduling = (calendarData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // dateStart랑 dateEnd 빼주기
        const daysDifference = (0, date_fns_1.differenceInDays)(calendarData.dateEnd, calendarData.dateStart);
        // 배열 생성
        const schedules = [];
        // Iterate over the date range and create a schedule for each day
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
        console.error('Error creating schedule-ready events', error);
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
        console.error('Error retrieving calendar events', error);
        throw error;
    }
});
exports.showCalendar = showCalendar;
// 일정 수정
const updateCalendar = (eventId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEvent = yield findCalendarEventById(eventId);
        if (!existingEvent) {
            throw new Error('Calendar event not found');
        }
        const updatedEvent = yield prisma.calendar.update({
            where: {
                id: eventId,
            },
            data: {
                userId: updateData.userId,
                title: updateData.dutyName,
                dateStart: updateData.dateStart,
                dateEnd: updateData.dateEnd,
                timeStart: updateData.timeStart,
                timeEnd: updateData.timeEnd,
            },
        });
        return updatedEvent;
    }
    catch (error) {
        console.error('Error updating calendar event', error);
        throw error;
    }
});
exports.updateCalendar = updateCalendar;
// 일정 삭제
const deleteCalendar = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEvent = yield findCalendarEventById(eventId);
        if (!existingEvent) {
            throw new Error('Calendar event not found');
        }
        yield prisma.calendar.delete({
            where: {
                id: eventId,
            },
        });
        return 0;
    }
    catch (error) {
        console.error('Error deleting calendar event', error);
        throw error;
    }
});
exports.deleteCalendar = deleteCalendar;
// 이번주 날짜 반환
const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const startDate = (0, date_fns_1.startOfWeek)(currentDate, { weekStartsOn: 1 }); // Assuming Monday is the start of the week
    const endDate = (0, date_fns_1.endOfWeek)(currentDate, { weekStartsOn: 1 });
    return { startDate, endDate };
};
exports.getCurrentWeekDates = getCurrentWeekDates;
// 이번주 날짜로 일정 반환
const searchThisWeeksDuty = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.searchThisWeeksDuty = searchThisWeeksDuty;
//# sourceMappingURL=CalendarService.js.map