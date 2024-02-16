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
exports.updateFeedContent = exports.showFeed = exports.pinFeed = exports.findFeedByFeedId = exports.deleteFeed = exports.createFeed = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const UserServiceUtils = __importStar(require("./User/UserServiceUtils"));
const NotificationService = __importStar(require("./NotificationService"));
const message_1 = __importDefault(require("../modules/message"));
// -------utils--------
// 존재하는 feedId인지 찾기
const findFeedEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.feed.findUnique({
            where: {
                id: eventId,
            },
        });
        return event;
    }
    catch (error) {
        console.error('error :: service/feed/feedService/findFeedEventById', error);
        throw error;
    }
});
// ------- real service -------
//신규 피드 등록
const createFeed = (userId, groupId, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield prisma.feed.create({
            data: {
                userId: userId,
                groupId: groupId,
                content: content,
            },
        });
        const resUserName = yield UserServiceUtils.getUserNameByUserId(event.userId);
        const resUserColor = yield UserServiceUtils.findUserColorByUserId(event.userId);
        yield NotificationService.makeNotification(groupId, userId, 'createFeed');
        const data = {
            feedId: event.id,
            userId: event.userId,
            userName: resUserName,
            userColor: resUserColor,
            groupId: event.groupId,
            content: event.content,
            createdAt: event.createdAt,
            pinned: event.pin,
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/feed/createFeed', error);
        throw error;
    }
});
exports.createFeed = createFeed;
//피드내용 수정
const updateFeedContent = (
//userId: string, groupId: string,
feedId, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEvent = yield findFeedEventById(feedId);
        if (!existingEvent) {
            throw new Error(message_1.default.NOT_FOUND_CAL);
        }
        const updatedEvent = yield prisma.feed.update({
            where: {
                id: feedId,
            },
            data: {
                content: content,
            },
        });
        const resUserName = yield UserServiceUtils.getUserNameByUserId(updatedEvent.userId);
        const resUserColor = yield UserServiceUtils.findUserColorByUserId(updatedEvent.userId);
        const FeedToReturn = {
            feedId: updatedEvent.id,
            userId: updatedEvent.userId,
            userName: resUserName,
            userColor: resUserColor,
            groupId: updatedEvent.groupId,
            content: updatedEvent.content,
            createdAt: updatedEvent.createdAt,
            pinned: updatedEvent.pin,
        };
        return FeedToReturn;
    }
    catch (error) {
        console.error('error :: service/feed/updatefeed', error);
        throw error;
    }
});
exports.updateFeedContent = updateFeedContent;
//피드 고정
const pinFeed = (FeedId, Pinned) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pinnedFeed = yield prisma.feed.update({
            where: {
                id: FeedId,
            },
            data: {
                pin: Pinned
            },
        });
        const resUserName = yield UserServiceUtils.getUserNameByUserId(pinnedFeed.userId);
        const resUserColor = yield UserServiceUtils.findUserColorByUserId(pinnedFeed.userId);
        const data = {
            feedId: pinnedFeed.id,
            userId: pinnedFeed.userId,
            userName: resUserName,
            userColor: resUserColor,
            groupId: pinnedFeed.groupId,
            content: pinnedFeed.content,
            createdAt: pinnedFeed.createdAt,
            pin: pinnedFeed.pin,
        };
        return (data);
    }
    catch (error) {
        console.error('error :: service/feed/pinfeed', error);
        throw error;
    }
});
exports.pinFeed = pinFeed;
//피드 삭제
const deleteFeed = (FeedId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toBeDeleted = yield findFeedByFeedId(FeedId);
        if (!toBeDeleted) {
            throw new Error('Feed not found');
        }
        yield prisma.feed.delete({
            where: {
                id: FeedId,
            },
        });
        return 0;
    }
    catch (error) {
        throw new Error('Error deleting feed');
    }
});
exports.deleteFeed = deleteFeed;
const showFeed = (GroupId) => __awaiter(void 0, void 0, void 0, function* () {
    const Feeds = yield prisma.feed.findMany({
        where: {
            groupId: GroupId,
        },
        orderBy: {
            id: 'desc',
        },
    });
    let FeedsToShow = [];
    yield Promise.all(Feeds.map((feed) => __awaiter(void 0, void 0, void 0, function* () {
        let resUserName = yield UserServiceUtils.getUserNameByUserId(feed.userId);
        let resUserColor = yield UserServiceUtils.findUserColorByUserId(feed.userId);
        FeedsToShow.push({
            feedId: feed.id,
            userId: feed.userId,
            groupId: feed.groupId,
            userName: resUserName,
            userColor: resUserColor,
            content: feed.content,
            createdAt: feed.createdAt,
            pinned: feed.pin
        });
    })));
    return FeedsToShow;
});
exports.showFeed = showFeed;
//피드 찾기
const findFeedByFeedId = (FeedId) => __awaiter(void 0, void 0, void 0, function* () {
    const Feed = yield prisma.feed.findUnique({
        where: {
            id: FeedId,
        },
    });
    if (!Feed) {
        throw new Error('No Feed Found!');
    }
    const resUserName = yield UserServiceUtils.getUserNameByUserId(Feed.userId);
    const resUserColor = yield UserServiceUtils.findUserColorByUserId(Feed.userId);
    const data = {
        feedId: Feed.id,
        userId: Feed.userId,
        userName: resUserName,
        userColor: resUserColor,
        groupId: Feed.groupId,
        content: Feed.content,
        createdAt: Feed.createdAt,
        pin: Feed.pin,
    };
    return data;
});
exports.findFeedByFeedId = findFeedByFeedId;
//# sourceMappingURL=FeedService.js.map