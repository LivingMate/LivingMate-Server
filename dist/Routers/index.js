"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedRouter_1 = require("./FeedRouter");
const CalendarRouter_1 = require("./CalendarRouter");
const routes = (0, express_1.Router)();
routes.use('/feed', FeedRouter_1.FeedRouter);
routes.use('/Calendar', CalendarRouter_1.CalendarRouter);
exports.default = routes;
//1. import 하는 방식에 문제가 있다
//2. 라우터를 그냥 한 파일에 옮겨라 
//# sourceMappingURL=index.js.map