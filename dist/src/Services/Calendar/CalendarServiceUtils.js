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
exports.getParticipantInfo = exports.makeArray = exports.updateParticipants = exports.multipleParticipants = exports.getParticipantsForEvent = exports.groupThisWeekEvents = exports.getDayOfWeek = exports.getCurrentMonthDates = exports.getCurrentWeekDates = exports.deleteThisRepeatCalendar = exports.deleteRepeatCalendar = exports.updateRepeatCalendar = exports.createRepeatCalendar = exports.checkExistSchedule = exports.findParticipantEventById = exports.findSchedulingEventById = exports.findCalendarEventById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dayjs_1 = __importDefault(require("dayjs"));
const date_fns_1 = require("date-fns");
const NotificationService = __importStar(require("../NotificationService"));
// 캘린더Id로 레코드 갖고오기
const findCalendarEventById = (calendarId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.calendar.findUnique({
            where: {
                id: calendarId,
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
// 일정조율1 ID로 일정조율2에 해당하는 타임슬럿들 갖고오기
const findSchedulingEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.scheduling.findMany({
            where: {
                scheduleId: eventId,
            },
        });
        return event;
    }
    catch (error) {
        console.error('error :: service/calendar/CalendarServiceUtils/findSchedulingEventById', error);
        throw error;
    }
});
exports.findSchedulingEventById = findSchedulingEventById;
// 캘린더 Id로 해당하는 participants들 받아오기
const findParticipantEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.participant.findMany({
            where: {
                calendarId: eventId,
            },
        });
        return event;
    }
    catch (error) {
        console.error('error :: service/calendar/CalendarServiceUtils/findParticipantEventById', error);
        throw error;
    }
});
exports.findParticipantEventById = findParticipantEventById;
// 스케줄이 존재하는지 확인
const checkExistSchedule = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.schedule.findUnique({
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
// 반복 일정 생성 유틸
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
            yield multipleParticipants(calendarCreateDto.participants, groupId, event.id);
            const data = {
                calendarId: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
                dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
                term: event.term,
                memo: event.memo,
                participants: yield makeArray(event.id),
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
        // 알림 생성
        yield NotificationService.makeNotification(groupId, userId, 'createRepeatCalendar');
        return createdEvents;
    }
    catch (error) {
        console.error('error :: service/calendar/createRecurringCalendar', error);
        throw error;
    }
});
exports.createRepeatCalendar = createRepeatCalendar;
// 반복 일정 업뎃 유틸
const updateRepeatCalendar = (userId, groupId, calendarUpdateDto, recurrenceCount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdEvents = [];
        const startDate = new Date((0, dayjs_1.default)(calendarUpdateDto.dateStart).format('YYYY-MM-DD HH:mm:ss'));
        const endDate = new Date((0, dayjs_1.default)(calendarUpdateDto.dateEnd).format('YYYY-MM-DD HH:mm:ss'));
        for (let i = 0; i < recurrenceCount; i++) {
            const event = yield prisma.calendar.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    title: calendarUpdateDto.title,
                    dateStart: new Date(startDate),
                    dateEnd: new Date(endDate),
                    term: calendarUpdateDto.term,
                    memo: calendarUpdateDto.memo || '',
                },
            });
            // const participantUserIds: ParticipantInfo[] = (await makeArray(event.id));
            yield multipleParticipants(calendarUpdateDto.participants, groupId, event.id);
            const data = {
                Id: event.id,
                userId: event.userId,
                groupId: event.groupId,
                title: event.title,
                dateStart: (0, dayjs_1.default)(event.dateStart).format('YYYY-MM-DD HH:mm:ss'),
                dateEnd: (0, dayjs_1.default)(event.dateEnd).format('YYYY-MM-DD HH:mm:ss'),
                term: event.term,
                memo: event.memo,
                participants: yield makeArray(event.id),
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
// 반복 일정 '업뎃'에 사용되는 삭제 유틸
const deleteRepeatCalendar = (eventId, term, userId, groupId, title, memo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: 삭제할 calendarId 조회
        const calendarIdsToDelete = yield prisma.calendar.findMany({
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
        const deletedParticipants = yield prisma.participant.deleteMany({
            where: {
                calendarId: {
                    in: calendarIdsToDelete.map((calendar) => calendar.id),
                },
            },
        });
        // Step 3: 실제 calendar 삭제 및 개수 가져오기
        const deletedCalendars = yield prisma.calendar.deleteMany({
            where: {
                id: {
                    in: calendarIdsToDelete.map((calendar) => calendar.id),
                },
            },
        });
        console.log(`Deleted ${deletedCalendars.count} calendars and ${deletedParticipants.count} participants.`);
    }
    catch (error) {
        console.error('error :: service/calendar/calendarServiceUtil/deleteRepeatCalendar', error);
        throw error;
    }
});
exports.deleteRepeatCalendar = deleteRepeatCalendar;
// 반복 일정 '삭제'에 사용되는 삭제 유틸
const deleteThisRepeatCalendar = (calendarId, term, userId, groupId, title, memo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: 삭제할 calendarId 조회
        const calendarIdsToDelete = yield prisma.calendar.findMany({
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
        });
        // Step 2: 삭제할 calendarId에 해당하는 participant 삭제 및 개수 가져오기
        const deletedParticipants = yield prisma.participant.deleteMany({
            where: {
                calendarId: {
                    in: calendarIdsToDelete.map((calendar) => calendar.id),
                },
            },
        });
        // Step 3: 실제 calendar 삭제 및 개수 가져오기
        const deletedCalendars = yield prisma.calendar.deleteMany({
            where: {
                id: {
                    in: calendarIdsToDelete.map((calendar) => calendar.id),
                },
            },
        });
        // deletedCalendars와 deletedParticipants에 각각 몇 개가 삭제되었는지 정보가 들어있습니다.
        console.log(`Deleted ${deletedCalendars.count} calendars and ${deletedParticipants.count} participants.`);
    }
    catch (error) {
        console.error('error :: service/calendar/calendarServiceUtil/deleteRepeatCalendar', error);
        throw error;
    }
});
exports.deleteThisRepeatCalendar = deleteThisRepeatCalendar;
// 이번주 날짜 반환
const getCurrentWeekDates = () => {
    try {
        const currentDate = new Date();
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
// 이번달 날짜 반환
const getCurrentMonthDates = () => {
    try {
        const currentDate = new Date();
        const startDate = (0, date_fns_1.startOfMonth)(currentDate);
        const endDate = (0, date_fns_1.endOfMonth)(currentDate);
        return { startDate, endDate };
    }
    catch (error) {
        console.error('error :: service/calendar/CalendarServiceUtils/getCurrentMonthDates', error);
        throw error;
    }
};
exports.getCurrentMonthDates = getCurrentMonthDates;
// 날짜를 요일로 변환
const getDayOfWeek = (date) => {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
};
exports.getDayOfWeek = getDayOfWeek;
// 반환될 이번주 일정 중 반복일정을 묶어주는 유틸
const groupThisWeekEvents = (events) => __awaiter(void 0, void 0, void 0, function* () {
    const groupedEvents = {};
    for (const event of events) {
        const key = `${event.title}-${event.memo || ''}-${event.groupId}-${event.term}`;
        if (!groupedEvents[key]) {
            const participants = yield getParticipantsForEvent(event.id);
            const daysOfWeek = [getDayOfWeek(event.dateStart)]; // 배열로 변경
            groupedEvents[key] = Object.assign(Object.assign({}, event), { daysOfWeek, participants });
        }
        else {
            // 이미 있는 경우, daysOfWeek를 합친다.
            const existingGroup = groupedEvents[key];
            existingGroup.daysOfWeek.push(...getDayOfWeek(event.dateStart));
        }
    }
    return Object.values(groupedEvents);
});
exports.groupThisWeekEvents = groupThisWeekEvents;
//참여자가 여러명인 경우
const multipleParticipants = (participants, groupId, calendarId) => __awaiter(void 0, void 0, void 0, function* () {
    const num = participants.length;
    try {
        const existingEvent = yield findParticipantEventById(calendarId);
        if (existingEvent) {
            // Assuming you want to delete existing participants only, not the whole event
            yield prisma.participant.deleteMany({
                where: {
                    calendarId: calendarId,
                },
            });
        }
        const createdEvents = [];
        for (let i = 0; i < num; i++) {
            const userId = participants[i];
            // Fetch additional participant information using getParticipantInfo service
            const participantInfo = yield getParticipantInfo(userId);
            const event = yield prisma.participant.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    calendarId: calendarId,
                },
            });
            createdEvents.push({
                userId: userId,
                userName: participantInfo.userName,
                userColor: participantInfo.userColor,
            });
        }
        return createdEvents;
    }
    catch (error) {
        console.error('Error creating participants array', error);
        throw error;
    }
});
exports.multipleParticipants = multipleParticipants;
// 이벤트에 대한 참가자 가져오기
const getParticipantsForEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const participants = yield prisma.participant.findMany({
        where: {
            calendarId: eventId,
        },
        select: {
            userId: true,
        },
    });
    return participants.map((participant) => participant.userId);
});
exports.getParticipantsForEvent = getParticipantsForEvent;
// 참여자가 여러명인거를 수정할 경우
const updateParticipants = (participants, groupId, calendarId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 해당 calendarId를 가진 참가자 데이터 조회
        const existingParticipants = yield prisma.participant.findMany({
            where: {
                calendarId: calendarId,
            },
        });
        // 만약 해당 calendarId를 가진 참가자 데이터가 없다면 생성
        if (existingParticipants.length === 0) {
            const createdParticipants = yield Promise.all(participants.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
                return prisma.participant.create({
                    data: {
                        userId: userId,
                        groupId: groupId,
                        calendarId: calendarId,
                    },
                });
            })));
            return createdParticipants;
        }
        // 이미 해당 calendarId를 가진 참가자 데이터가 있다면 업데이트
        yield prisma.participant.deleteMany({
            where: {
                calendarId: calendarId,
            },
        });
        const updatedParticipants = yield Promise.all(participants.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
            return prisma.participant.create({
                data: {
                    userId: userId,
                    groupId: groupId,
                    calendarId: calendarId,
                },
            });
        })));
        return updatedParticipants;
    }
    catch (error) {
        console.error('Error updating participants array', error);
        throw error;
    }
});
exports.updateParticipants = updateParticipants;
// 참가자 각각을 배열로 합치기
const makeArray = (calendarId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const participants = yield prisma.participant.findMany({
            where: {
                calendarId: calendarId,
            },
        });
        const userIds = participants.map((participant) => participant.userId);
        const users = yield prisma.user.findMany({
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
        });
        const userMap = new Map(users.map((user) => [user.id, user]));
        const arr = participants.map((participant) => {
            var _a, _b;
            return ({
                userId: participant.userId,
                userColor: ((_a = userMap.get(participant.userId)) === null || _a === void 0 ? void 0 : _a.userColor) || '',
                userName: ((_b = userMap.get(participant.userId)) === null || _b === void 0 ? void 0 : _b.userName) || '',
            });
        });
        return arr;
    }
    catch (error) {
        console.error('makeArray에서 오류 발생:', error);
        throw error;
    }
});
exports.makeArray = makeArray;
// 참여자의 Id로 이름과 색상 반환
const getParticipantInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
    }
    return {
        userId,
        userName: user.userName, // 여기서는 사용자의 이름 필드를 사용하도록 가정
        userColor: user.userColor, // 여기서는 사용자의 색상 필드를 사용하도록 가정
    };
});
exports.getParticipantInfo = getParticipantInfo;
//# sourceMappingURL=CalendarServiceUtils.js.map