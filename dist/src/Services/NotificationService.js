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
exports.getNotification = exports.getUserNotiTime = exports.getUserNotiState = exports.makeNotification = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const UserServiceUtils = __importStar(require("./User/UserServiceUtils"));
const GroupServiceUtils = __importStar(require("./Group/GroupServiceUtils"));
const makeNotification = (groupId, userId, notificationType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resUserName = yield UserServiceUtils.getUserNameByUserId(userId);
        let notificationText = '';
        switch (notificationType) {
            case 'createFeed':
                notificationText = `${resUserName}님이 새로운 게시글을 작성했습니다.`;
                break;
            case 'createCalendar':
                notificationText = `${resUserName}님이 새로운 일정을 등록했습니다.`;
                break;
            case 'createRepeatCalendar':
                notificationText = `${resUserName}님이 새로운 반복 일정을 등록했습니다.`;
                break;
            case 'createSchedule':
                notificationText = `${resUserName}님이 새로운 일정 조율을 등록했습니다.`;
                break;
            case 'createBudget':
                notificationText = `${resUserName}님이 새로운 지출을 추가했습니다.`;
                break;
            case 'startBudget':
                notificationText = `정산을 시작했습니다.`;
                break;
            case 'endBudget':
                notificationText = `정산이 완료되었습니다.`;
                break;
            case 'newUser':
                notificationText = `새로운 메이트 ${resUserName}님이 들어왔습니다.`;
                break;
            default:
                notificationText = '알 수 없는 알림 타입입니다.';
                break;
        }
        yield prisma.notification.create({
            data: {
                groupId: groupId,
                userId: userId,
                text: notificationText,
                isDelete: false,
            },
        });
    }
    catch (error) {
        console.error('error :: service/notification/makeNotification', error);
        throw error;
    }
});
exports.makeNotification = makeNotification;
const getUserNotiState = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const notiState = yield prisma.userNoti.findUnique({
            where: {
                userId: user.id
            }
        });
        if (notiState) {
            return notiState.state;
        }
        else {
            return 'error';
        }
    }
    catch (error) {
        console.error('error :: service/notification/getUserNotiState', error);
        throw error;
    }
});
exports.getUserNotiState = getUserNotiState;
const getUserNotiTime = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const notiTime = yield prisma.userNoti.findUnique({
            where: {
                userId: user.id
            }
        });
        if (notiTime) {
            return notiTime.updatedAt;
        }
        else {
            return 'error';
        }
    }
    catch (error) {
        console.error('error :: service/notification/getUserNotiTime', error);
        throw error;
    }
});
exports.getUserNotiTime = getUserNotiTime;
const getNotification = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(user.groupId);
        const notiState = yield getUserNotiState(user.id);
        const notiTime = yield getUserNotiTime(user.id);
        if (notiState !== true || notiTime === 'error') {
            return '알림이 없습니다';
        }
        const notis = yield prisma.notification.findMany({
            where: {
                groupId: group.id,
                createdAt: {
                    gte: notiTime
                }
            },
            orderBy: {
                id: 'desc',
            }
        });
        const formattedNotis = notis.map(({ id, text, createdAt }) => ({
            Id: id,
            text,
            createdAt,
        }));
        const data = {
            Notifications: formattedNotis,
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/notification/getNotification', error);
        throw error;
    }
});
exports.getNotification = getNotification;
//# sourceMappingURL=NotificationService.js.map