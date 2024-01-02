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
exports.getCurrentWeekDates = exports.deleteRepeatCalendar = exports.updateRepeatCalendar = exports.checkExistSchedule = exports.makeCalendarEventExist = exports.findCalendarEventById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const date_fns_1 = require("date-fns");
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
        console.error('error :: service/calendar/CalendarServiceUtils/findCalendarEventById', error);
        throw error;
    }
});
exports.findCalendarEventById = findCalendarEventById;
// 만약 반복 일정인 것이라면 여기에 그 일정에 대한 정보가 저장이 됨(반복 제거)
const makeCalendarEventExist = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exist = yield prisma.calendar.findUnique({
            where: {
                id: eventId,
            },
        });
        if (exist) {
            const event = yield prisma.existCalendar.create({
                data: {
                    groupId: exist.groupId,
                    title: exist.title,
                    dateStart: exist.dateStart,
                    term: exist.term,
                },
            });
            return event;
        }
    }
    catch (error) {
        console.error('Error finding calendar event by ID', error);
        throw error;
    }
});
exports.makeCalendarEventExist = makeCalendarEventExist;
// 스케줄이 존재하는지 확인
const checkExistSchedule = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.scheduling.findUnique({
            where: {
                id: eventId,
            },
        });
        if (event) {
            throw new Error('already made schedule');
        }
    }
    catch (error) {
        console.error('error :: service/calendar/CalendarServiceUtils/checkExistSchedule', error);
        throw error;
    }
});
exports.checkExistSchedule = checkExistSchedule;
const updateRepeatCalendar = (userId, groupId, calendarUpdateDto, recurrenceCount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdEvents = [];
        const startDate = new Date((0, dayjs_1.default)(calendarUpdateDto.dateStart).format('YYYY-MM-DD'));
        const endDate = new Date((0, dayjs_1.default)(calendarUpdateDto.dateEnd).format('YYYY-MM-DD'));
        for (let i = 0; i < recurrenceCount; i++) {
            const event = yield prisma.calendar.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    title: calendarUpdateDto.title,
                    dateStart: new Date(startDate),
                    dateEnd: new Date(endDate),
                    timeStart: new Date((0, dayjs_1.default)(calendarUpdateDto.timeStart).format('YYYY-MM-DD')),
                    timeEnd: new Date((0, dayjs_1.default)(calendarUpdateDto.timeEnd).format('YYYY-MM-DD')),
                    term: calendarUpdateDto.term,
                    memo: calendarUpdateDto.memo || '',
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
            switch (calendarUpdateDto.term) {
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
        console.error('error :: service/calendar/CalendarServiceUtils/updateRepeatCalendar', error);
        throw error;
    }
});
exports.updateRepeatCalendar = updateRepeatCalendar;
// CalendarServiceUtils.deleteRepeatSchedules 함수 예시
// CalendarServiceUtils.deleteRepeatSchedules 함수 예시
const deleteRepeatCalendar = (eventId, term, userId, groupId, title, memo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.calendar.deleteMany({
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
        });
    }
    catch (error) {
        console.error('error :: service/calendar/deleteRepeatSchedules', error);
        throw error;
    }
});
exports.deleteRepeatCalendar = deleteRepeatCalendar;
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
        console.error('error :: service/calendar/CalendarServiceUtils/getCurrentWeekDates', error);
        throw error;
    }
};
exports.getCurrentWeekDates = getCurrentWeekDates;
//# sourceMappingURL=CalendarServiceUtils.js.map