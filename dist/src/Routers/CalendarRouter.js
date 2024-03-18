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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarRouter = void 0;
const express_1 = __importDefault(require("express"));
const CalendarController = __importStar(require("../Controllers/CalendarController"));
const auth_1 = __importDefault(require("../Middleware/auth"));
const CalendarRouter = express_1.default.Router();
exports.CalendarRouter = CalendarRouter;
CalendarRouter.post('/calendar/create', auth_1.default, CalendarController.createCalendar);
CalendarRouter.post('/calendar/create/schedule', auth_1.default, CalendarController.createSchedule);
CalendarRouter.post('/calendar/create/schedule/timeslot/:scheduleId', auth_1.default, CalendarController.createScheduling);
CalendarRouter.patch('/calendar/update/:calendarId', auth_1.default, CalendarController.updateCalendarEvent);
CalendarRouter.delete('/calendar/delete/:calendarId', auth_1.default, CalendarController.deleteCalendarEvent);
CalendarRouter.delete('/calendar/delete/schedule/:scheduleId', auth_1.default, CalendarController.deleteScheduleEvent);
CalendarRouter.get('/calendar', auth_1.default, CalendarController.showCalendar);
CalendarRouter.get('/calendar/:calendarId', auth_1.default, CalendarController.showOneCalendar);
CalendarRouter.get('/calendar/get/month/:dateString', auth_1.default, CalendarController.showMonthCalendar);
CalendarRouter.get('/calendar/get/week', auth_1.default, CalendarController.getThisWeeksDuty);
CalendarRouter.get('/calendar/schedule/schedule', auth_1.default, CalendarController.showSchedule);
CalendarRouter.get('/calendar/schedule/timeslot/:scheduleId', auth_1.default, CalendarController.showScheduling);
//# sourceMappingURL=CalendarRouter.js.map