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
const CalendarService_1 = __importDefault(require("../Services/CalendarService"));
// POST
const createCalendarEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calendarData = req.body;
        const newCalendarEvent = yield CalendarService_1.default.createCalendar(calendarData);
        res.status(201).json(newCalendarEvent);
    }
    catch (error) {
        console.error('Error creating calendar event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const createScheduleReadyEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calendarData = req.body;
        const newScheduleReadyEvent = yield CalendarService_1.default.createScheduleReady(calendarData);
        res.status(201).json(newScheduleReadyEvent);
    }
    catch (error) {
        console.error('Error creating schedule-ready event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const createSchedulingEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calendarData = req.body;
        const newSchedulingEvent = yield CalendarService_1.default.createScheduling(calendarData);
        res.status(201).json(newSchedulingEvent);
    }
    catch (error) {
        console.error('Error creating scheduling events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// FETCH
const updateCalendarEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = parseInt(req.params.id, 10);
        const updateData = req.body;
        const updatedCalendarEvent = yield CalendarService_1.default.updateCalendar(eventId, updateData);
        res.status(200).json(updatedCalendarEvent);
    }
    catch (error) {
        console.error('Error updating calendar event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// DELETE
const deleteCalendarEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = parseInt(req.params.id, 10);
        yield CalendarService_1.default.deleteCalendar(eventId);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting calendar event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// GET
const getThisWeeksDuty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.groupId;
        const thisWeeksDuty = yield CalendarService_1.default.searchThisWeeksDuty(groupId);
        res.status(200).json(thisWeeksDuty);
    }
    catch (error) {
        console.error("Error getting this week's duty", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const showCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.groupId;
        const calendarEvents = yield CalendarService_1.default.showCalendar(groupId);
        res.status(200).json(calendarEvents);
    }
    catch (error) {
        console.error('Error retrieving calendar events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = {
    createCalendarEvent,
    createScheduleReadyEvent,
    createSchedulingEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getThisWeeksDuty,
    showCalendar,
};
//# sourceMappingURL=CalendarController.js.map