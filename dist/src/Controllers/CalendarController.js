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
exports.showScheduling = exports.showSchedule = exports.showMonthCalendar = exports.showOneCalendar = exports.showCalendar = exports.getThisWeeksDuty = exports.deleteScheduleEvent = exports.deleteCalendarEvent = exports.updateCalendarEvent = exports.createScheduling = exports.createSchedule = exports.createCalendar = void 0;
const express_validator_1 = require("express-validator");
const CalendarService = __importStar(require("../Services/Calendar/CalendarService"));
const GroupServiceUtils = __importStar(require("../Services/Group/GroupServiceUtils"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const message_1 = __importDefault(require("../modules/message"));
const util_1 = __importDefault(require("../modules/util"));
// POST -------------------------------------------------------------------------------
const createCalendar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    const calendarCreateDto = req.body;
    try {
        const data = yield CalendarService.createCalendar(userId, groupId, calendarCreateDto);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.CREATE_CAL_SUCCESS, data));
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
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    const scheduleCreateDto = req.body;
    try {
        const data = yield CalendarService.createSchedule(groupId, userId, scheduleCreateDto);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.CREATE_SCDL_SUCCESS, data));
    }
    catch (error) {
        console.error('Error creating schedule event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createSchedule = createSchedule;
const createScheduling = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    try {
        const userId = req.body.user.id;
        const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
        const scheduleId = parseInt(req.params.scheduleId);
        const schedulingCreateDto = req.body;
        const data = yield CalendarService.createScheduling(groupId, scheduleId, schedulingCreateDto);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.CREATE_TS_SUCCESS, data));
    }
    catch (error) {
        console.error('Error creating scheduling events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createScheduling = createScheduling;
// FETCH
const updateCalendarEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    const calendarId = parseInt(req.params.calendarId);
    const calendarUpdateDto = req.body;
    try {
        const data = yield CalendarService.updateCalendar(userId, groupId, calendarId, calendarUpdateDto);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.UPDATE_CAL_SUCCESS, data));
    }
    catch (error) {
        console.error('Error updating calendar event', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.updateCalendarEvent = updateCalendarEvent;
// DELETE
const deleteCalendarEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    const calenarId = parseInt(req.params.calendarId);
    try {
        const data = yield CalendarService.deleteCalendar(userId, groupId, calenarId);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.DELETE_CAL_SUCCESS));
    }
    catch (error) {
        console.error('Error deleting calendar event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteCalendarEvent = deleteCalendarEvent;
const deleteScheduleEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    const scheduleId = parseInt(req.params.scheduleId);
    try {
        const data = yield CalendarService.deleteSchedule(groupId, scheduleId);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.DELETE_SCDL_TS_SUCCESS));
    }
    catch (error) {
        console.error('Error deleting schedule&scheduling event', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteScheduleEvent = deleteScheduleEvent;
// GET
const getThisWeeksDuty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    try {
        const thisWeeksDuty = yield CalendarService.getThisWeeksDuty(groupId);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.READ_THISWEEK_SUCCESS, thisWeeksDuty));
    }
    catch (error) {
        console.error("Error getting this week's duty", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getThisWeeksDuty = getThisWeeksDuty;
const showCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    try {
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
const showOneCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const calendarId = parseInt(req.params.calendarId);
    try {
        const calendarEvents = yield CalendarService.showOneCalendar(calendarId);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.READ_ONE_CAL_SUCCESS, calendarEvents));
    }
    catch (error) {
        console.error('Error getting one calendar events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.showOneCalendar = showOneCalendar;
const showMonthCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    const dateString = req.params.dateString;
    try {
        const calendarEvents = yield CalendarService.showMonthCalendar(groupId, dateString);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.READ_THIMONTH_SUCCESS, calendarEvents));
    }
    catch (error) {
        console.error('Error getting month calendar events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.showMonthCalendar = showMonthCalendar;
const showSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    try {
        const scheduleEvents = yield CalendarService.showSchedule(groupId);
        res.status(200).json(scheduleEvents);
        console.log(scheduleEvents);
    }
    catch (error) {
        console.error('Error retrieving schedule events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.showSchedule = showSchedule;
const showScheduling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupId = yield GroupServiceUtils.findGroupIdByUserId(userId);
    try {
        const scheduleId = parseInt(req.params.scheduleId, 10);
        const scheduleEvents = yield CalendarService.showScheduling(groupId, scheduleId);
        res.status(200).json(scheduleEvents);
        console.log(scheduleEvents);
    }
    catch (error) {
        console.error('Error retrieving schedule events', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.showScheduling = showScheduling;
//# sourceMappingURL=CalendarController.js.map