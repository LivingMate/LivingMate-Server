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
exports.findGroupOwner = exports.findUserNotiIdbyUserId = exports.createEmail = exports.createUserId = exports.duplicateId = exports.createColor = exports.addUserNotiToGroup = exports.addUserToGroup = exports.findUserColorByUserId = exports.updateUserColor = exports.getUserNameByUserId = exports.findUserById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const NotificationService = __importStar(require("../NotificationService"));
const message_1 = __importDefault(require("../../modules/message"));
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error('User not found!');
        }
        return user;
    }
    catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
});
exports.findUserById = findUserById;
//유저 아이디로 유저 이름 찾기
function getUserNameByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (result) {
                return result.userName;
            }
            else {
                return 'error';
            }
        }
        catch (error) {
            console.error('Error in getUserNameByUserId:', error);
            throw error;
        }
    });
}
exports.getUserNameByUserId = getUserNameByUserId;
const updateUserColor = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const color = yield createColor();
    const userWithColor = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            userColor: color,
        },
    });
    return userWithColor;
});
exports.updateUserColor = updateUserColor;
// userId로 userColor 찾기
const findUserColorByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (data) {
            return data.userColor;
        }
        else {
            return 'error';
        }
    }
    catch (error) {
        console.error('error :: service/userUtils/findUserColorByUserId', error);
        throw error;
    }
});
exports.findUserColorByUserId = findUserColorByUserId;
//+ 그룹 참여하는 서비스
const addUserToGroup = (userId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            groupId: groupId,
        },
    });
    yield NotificationService.makeNotification(groupId, userId, 'newUser');
    //return data
});
exports.addUserToGroup = addUserToGroup;
// userNoti groupId도 바꿔주기
const addUserNotiToGroup = (userId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.userNoti.update({
        where: {
            userId: userId,
        },
        data: {
            groupId: groupId,
        },
    });
});
exports.addUserNotiToGroup = addUserNotiToGroup;
const createColor = () => __awaiter(void 0, void 0, void 0, function* () {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + color;
});
exports.createColor = createColor;
const duplicateId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!user)
        return false;
    else
        return true;
});
exports.duplicateId = duplicateId;
const createUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const size = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result = '';
    do {
        result = '';
        for (let i = 0; i < size; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while (yield duplicateId(result));
    return result;
});
exports.createUserId = createUserId;
const createEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    const size = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result = '';
    do {
        result = '';
        for (let i = 0; i < size; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while (yield duplicateId(result));
    return result;
});
exports.createEmail = createEmail;
const findUserNotiIdbyUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.userNoti.findUnique({
            where: {
                userId: userId
            },
        });
        if (!data) {
            throw new Error(message_1.default.UNAUTHORIZED);
        }
        return data;
    }
    catch (error) {
        console.error('error :: service/userUtils/findUserNotiIdbyUserId', error);
        throw error;
    }
});
exports.findUserNotiIdbyUserId = findUserNotiIdbyUserId;
const findGroupOwner = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.group.findUnique({
            where: {
                id: groupId
            },
        });
        if (!data) {
            throw new Error(message_1.default.UNAUTHORIZED);
        }
        return data.groupOwner;
    }
    catch (error) {
        console.error('error :: service/userUtils/findGroupOwner', error);
        throw error;
    }
});
exports.findGroupOwner = findGroupOwner;
//# sourceMappingURL=UserServiceUtils.js.map