"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CalendarController_1 = __importDefault(require("../Controllers/CalendarController"));
const calendarRouter = express_1.default.Router();
calendarRouter.get('/:calendar', CalendarController_1.default.showCalendar);
calendarRouter.post('/:calendar', CalendarController_1.default.createCalendarEvent);
calendarRouter.patch(':calendar', CalendarController_1.default.updateCalendarEvent);
calendarRouter.delete('/:calendar', CalendarController_1.default.deleteCalendarEvent);
exports.default = calendarRouter;
//# sourceMappingURL=CalendarRouter.js.map