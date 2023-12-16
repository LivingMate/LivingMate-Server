"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedController_1 = __importDefault(require("../Controllers/FeedController"));
const router = (0, express_1.Router)();
router.get('/feed', FeedController_1.default.showFeed);
router.post('/feed', FeedController_1.default.createFeed);
router.patch('/feed/:feedId', FeedController_1.default.updateFeed);
router.delete('/feed/:feedId', FeedController_1.default.deleteFeed);
exports.default = router;
//# sourceMappingURL=FeedRouter.js.map