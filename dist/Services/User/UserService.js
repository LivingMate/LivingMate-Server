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
exports.getUserNotiState = exports.notiYesNo = exports.userSetGet = exports.userSetUpdate = exports.getUserProfile = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const UserServiceUtils = __importStar(require("./UserServiceUtils"));
const GroupServiceUtils = __importStar(require("../Group/GroupServiceUtils"));
const prisma = new client_1.PrismaClient();
// 신규 유저 생성 & 알림 상태 생성
const createUser = (signupDtO) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = yield UserServiceUtils.createUserId();
    const user = yield prisma.user.create({
        data: {
            id: Id,
            userName: signupDtO.userName,
            groupId: signupDtO.groupId || 'aaaaaa', //default
            userColor: 'FFFFFF', //default, just temporary value for now
            email: signupDtO.email,
            sex: signupDtO.sex,
            age: signupDtO.age,
        },
    });
    const userNoti = yield prisma.userNoti.create({
        data: {
            userId: user.id,
            groupId: user.groupId,
            state: true
        }
    });
    const data = {
        userId: user.id,
        userName: user.userName,
        userColor: user.userColor,
        groupId: user.groupId,
        email: user.email,
        sex: user.sex,
        age: user.age,
        notificationState: userNoti.state
    };
    return data;
});
exports.createUser = createUser;
// 마이페이지 유저 정보 반환
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userProfile = yield UserServiceUtils.findUserById(userId);
        if (!userProfile) {
            throw new Error('User Not Found!');
        }
        if (userProfile.groupId === null || userProfile.groupId === undefined) {
            throw new Error('User has no group!');
        }
        const groupName = yield GroupServiceUtils.findGroupByGroupId(userProfile.groupId);
        const userGroupMembersNamesColors = yield GroupServiceUtils.findGroupMembersNamesColorsByGroupId(userProfile.groupId);
        const data = {
            userName: userProfile.userName,
            userColor: userProfile.userColor,
            groupName: groupName,
            membernamesandcolors: userGroupMembersNamesColors,
        };
        return data;
    }
    catch (error) {
        throw new Error('Error: getUserProfile:service');
    }
});
exports.getUserProfile = getUserProfile;
// 유저 정보 수정(이름&색상)
const userSetUpdate = (userId, userUpdateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            userName: userUpdateRequestDto.userName,
            userColor: userUpdateRequestDto.userColor,
        },
    });
    const data = {
        userName: updatedUser.userName,
        userColor: updatedUser.userColor,
    };
    return data;
});
exports.userSetUpdate = userSetUpdate;
// 유저 정보 조회(이름&색상)
const userSetGet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserServiceUtils.findUserById(userId);
    if (!user) {
        throw new Error('User Not Found!');
    }
    const data = {
        userName: user.userName,
        userColor: user.userColor,
    };
    return data;
});
exports.userSetGet = userSetGet;
// 유저 알림 설정 여부(on off)
const notiYesNo = (userId, notificationState) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notiState = yield prisma.userNoti.update({
            where: {
                userId: userId,
            },
            data: {
                state: notificationState,
            },
        });
        const data = {
            notificationState: notiState.state
        };
        return data;
    }
    catch (error) {
        throw new Error('Error: service/user/notiYesNo');
    }
});
exports.notiYesNo = notiYesNo;
// 유저 알림 상태 가져오기 (on off)
const getUserNotiState = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const userNotiId = UserServiceUtils.findUserNotiIdbyUserId(user.id);
        if (!user) {
            throw new Error('User Not Found!');
        }
        const data = {
            notiState: (yield userNotiId).state
        };
        return data;
    }
    catch (error) {
        throw new Error('Error: service/user/getUserNotiState');
    }
});
exports.getUserNotiState = getUserNotiState;
//# sourceMappingURL=UserService.js.map