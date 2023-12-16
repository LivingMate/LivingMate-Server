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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const date_fns_1 = require("date-fns");
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
// 바로 등록 생성 // 스케줄링 끝내고 일정 생성할때도 이거 쓰기
const createCalendar = (calendarData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCalendar = yield prisma.calendar.create({
            data: {
                userId: calendarData.userId,
                groupId: calendarData.groupId,
                title: calendarData.dutyName,
                dateStart: calendarData.dateStart,
                dateEnd: calendarData.dateEnd,
                timeStart: calendarData.timeStart,
                timeEnd: calendarData.timeEnd,
                memo: calendarData.memo || ' ',
            },
        });
        // Your logic here, e.g., send a notification, update UI, etc.
        return newCalendar;
    }
    catch (error) {
        console.error('Error creating calendar event', error);
        throw error;
    }
});
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
// 이번주 날짜 반환
const getCurrentWeekDates = () => {
    const currentDate = new Date();
    const startDate = (0, date_fns_1.startOfWeek)(currentDate, { weekStartsOn: 1 }); // Assuming Monday is the start of the week
    const endDate = (0, date_fns_1.endOfWeek)(currentDate, { weekStartsOn: 1 });
    return { startDate, endDate };
};
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
        console.error('Error searching this week\'s duty', error);
        throw error;
    }
});
exports.default = {
    findCalendarEventById,
    createCalendar,
    createScheduleReady,
    createScheduling,
    showCalendar,
    updateCalendar,
    deleteCalendar,
    getCurrentWeekDates,
    searchThisWeeksDuty,
};
//# sourceMappingURL=CalendarService.js.map