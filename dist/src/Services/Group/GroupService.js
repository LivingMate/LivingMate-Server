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
exports.outGroup = exports.updateGroupName = exports.leaveGroup = exports.goGroup = exports.getIdandName = exports.createGroup = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const UserServiceUtils = __importStar(require("../User/UserServiceUtils"));
const GroupServiceUtils = __importStar(require("./GroupServiceUtils"));
//그룹아이디 생성하기
const createGroupId = () => __awaiter(void 0, void 0, void 0, function* () {
    const size = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result = '';
    do {
        result = '';
        for (let i = 0; i < size; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while (yield UserServiceUtils.duplicateId(result));
    return result;
});
// 그룹 아이디, 그룹 이름 받아오기
const getIdandName = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(user.groupId);
        const data = {
            groupId: user.groupId,
            groupName: group.groupName
        };
        return data;
    }
    catch (error) {
        console.error('error :: group/GroupService/getIdandName', error);
        throw error;
    }
});
exports.getIdandName = getIdandName;
// 방장이 자신의 그룹 생성 후 자신 그룹 참여
const createGroup = (userId, groupName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const groupId = yield createGroupId();
        yield GroupServiceUtils.checkJoinedGroupId((user === null || user === void 0 ? void 0 : user.groupId) || '');
        const createdGroup = yield prisma.group.create({
            data: {
                id: groupId,
                groupOwner: userId,
                groupName: groupName,
                groupSpending: 0,
            },
        });
        for (let index = 1; index < 5; index++) {
            yield prisma.subCategory.create({
                data: {
                    groupId: groupId,
                    name: "기타",
                    categoryId: index
                }
            });
        }
        const GroupReturn = yield UserServiceUtils.addUserToGroup(userId, createdGroup.id);
        yield UserServiceUtils.addUserNotiToGroup(user.id, groupId);
        return createdGroup;
        //return createdGroup;
    }
    catch (error) {
        console.error('Error at creating Group: group service', error);
        throw new Error('Error at creating Group: group service');
    }
});
exports.createGroup = createGroup;
// 참여자들이 자기 그룹 찾아들어가기
const goGroup = (userId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const GroupReturn = yield UserServiceUtils.addUserToGroup(user.id, groupId);
        yield UserServiceUtils.addUserNotiToGroup(user.id, groupId);
        return GroupReturn;
    }
    catch (error) {
        console.error('Error at entering Group: group service', error);
    }
});
exports.goGroup = goGroup;
// 그룹 나가기
const leaveGroup = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(user.groupId);
        // user가 나가는지 groupOwner가 나가는지
        const event = prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                groupId: 'aaaaaa', // 또는 원하는 값으로 갱신
            },
        });
        const data = {
            userId: (yield event).id,
            groupId: (yield event).groupId,
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/group/leaveGroup', error);
    }
});
exports.leaveGroup = leaveGroup;
// 그룹 이름 수정
const updateGroupName = (userId, groupName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(user.groupId);
        const event = yield prisma.group.update({
            where: {
                id: group.id,
            },
            data: {
                groupName: groupName,
            },
        });
        const data = {
            groupId: event.id,
            groupName: event.groupName,
        };
        return data;
    }
    catch (error) {
        console.error('error :: service/group/updateGroupName', error);
    }
});
exports.updateGroupName = updateGroupName;
// 그룹 탈퇴
const outGroup = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(user.groupId);
        const event = yield prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                id: 'aaaaaa',
            },
        });
    }
    catch (error) {
        console.error('error :: service/group/outGroup', error);
    }
});
exports.outGroup = outGroup;
//# sourceMappingURL=GroupService.js.map