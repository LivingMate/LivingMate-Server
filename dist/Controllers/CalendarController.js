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
exports.showCalendar = exports.getThisWeeksDuty = exports.updateCalendarEvent = exports.createSchedule = exports.createCalendar = void 0;
const express_validator_1 = require("express-validator");
const CalendarService = __importStar(require("../Services/Calendar/CalendarService"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const message_1 = __importDefault(require("../modules/message"));
const util_1 = __importDefault(require("../modules/util"));
// POST
const createCalendar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const { userId } = req.params;
    const calendarCreateDto = req.body;
    const { groupId } = req.params;
    try {
        const data = yield CalendarService.createCalendar(userId, groupId, calendarCreateDto);
        console.log(data);
        res.status(201).json(data);
    }
    catch (error) {
        console.error('Error creating calendar event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createCalendar = createCalendar;
const createSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const scheduleCreateDto = req.body;
    const { groupId } = req.params;
    try {
        const data = yield CalendarService.createSchedule(groupId, scheduleCreateDto);
        console.log(data);
        res.status(201).json(data);
    }
    catch (error) {
        console.error('Error creating schedule event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createSchedule = createSchedule;
// const createScheduleReadyEvent = async (req: Request, res: Response) => {
//   try {
//     const calendarData = req.body
//     const newScheduleReadyEvent = await CalendarService.createScheduleReady(calendarData)
//     res.status(201).json(newScheduleReadyEvent)
//   } catch (error) {
//     console.error('Error creating schedule-ready event', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// }
// const createSchedulingEvent = async (req: Request, res: Response) => {
//   try {
//     const calendarData = req.body
//     const newSchedulingEvent = await CalendarService.createScheduling(calendarData)
//     res.status(201).json(newSchedulingEvent)
//   } catch (error) {
//     console.error('Error creating scheduling events', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// }
// FETCH
const updateCalendarEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = parseInt(req.params.id, 10);
        const updateData = req.body;
        const updatedCalendarEvent = yield CalendarService.updateCalendar(eventId, updateData);
        res.status(200).json(updatedCalendarEvent);
    }
    catch (error) {
        console.error('Error updating calendar event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateCalendarEvent = updateCalendarEvent;
// // DELETE
// const deleteCalendarEvent = async (req: Request, res: Response) => {
//   try {
//     const eventId = parseInt(req.params.id, 10)
//     await CalendarService.deleteCalendar(eventId)
//     res.status(204).send()
//   } catch (error) {
//     console.error('Error deleting calendar event', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// }
// GET
const getThisWeeksDuty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.groupId;
        const thisWeeksDuty = yield CalendarService.getThisWeeksDuty(groupId);
        res.status(200).json(thisWeeksDuty);
    }
    catch (error) {
        console.error("Error getting this week's duty", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getThisWeeksDuty = getThisWeeksDuty;
const showCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.groupId;
        const calendarEvents = yield CalendarService.showCalendar(groupId);
        res.status(200).json(calendarEvents);
        console.log(calendarEvents);
    }
    catch (error) {
        console.error('Error retrieving calendar events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.showCalendar = showCalendar;
//# sourceMappingURL=CalendarController.js.map