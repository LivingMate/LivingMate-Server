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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinFeed = exports.deleteFeed = exports.updateFeed = exports.createFeed = exports.showFeed = void 0;
const express_validator_1 = require("express-validator");
const FeedService = __importStar(require("../Services/FeedService"));
/*
get
/feeds
*/
const showFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    try {
        const data = yield FeedService.showFeed(groupId);
        console.log(data);
        return res.send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.showFeed = showFeed;
/*
  post
  /feeds
  */
const createFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new Error('Error at Controller: createFeed');
    }
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const feedcontent = req.body.content;
    try {
        const data = yield FeedService.createFeed(userId, groupId, feedcontent);
        return res.status(200).send(data);
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    }
    catch (error) {
        next(error);
    }
});
exports.createFeed = createFeed;
/*
  patch
  /feeds/:feedId
*/
const updateFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new Error('Error at Controller: updateFeed');
    }
    const content = req.body.content;
    const strFeedId = req.params.feedId;
    const feedId = parseInt(strFeedId);
    try {
        const data = yield FeedService.updateFeedContent(feedId, content);
        return res.status(200).send(data);
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    }
    catch (error) {
        next(error);
    }
});
exports.updateFeed = updateFeed;
/*
  pin!!
  patch
  /feeds/:feedId
*/
const pinFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new Error('Error at Controller: updateFeed');
    }
    const strFeedId = req.params.feedId;
    const feedId = parseInt(strFeedId);
    const pin = req.body.pin;
    try {
        const data = yield FeedService.pinFeed(feedId, pin);
        console.log(data);
        return res.status(200).send(data);
    }
    catch (error) {
        next(error);
    }
});
exports.pinFeed = pinFeed;
/*
  delete
  /feeds/:feedId
  */
const deleteFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new Error('Error at Controller: updateFeed');
    }
    const feedId = parseInt(req.params.feedId);
    try {
        yield FeedService.deleteFeed(feedId);
        return res.status(200).send('Feed Deleted!');
        //   util.success(statusCode.CREATED, message.CREATE_EVENT_SUCCESS, data)
        // );
    }
    catch (error) {
        next(error);
    }
});
exports.deleteFeed = deleteFeed;
//# sourceMappingURL=FeedController.js.map