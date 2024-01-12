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
exports.getGroup = exports.leaveGroup = exports.createGroup = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const UserService = __importStar(require("../UserService"));
const GroupServiceUtils = __importStar(require("./GroupServiceUtils"));
// createGroup
const createGroup = (userId, groupName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService.findUserById(userId);
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
        return createdGroup;
    }
    catch (error) {
        throw new Error('Error at creating Group: group service');
    }
});
exports.createGroup = createGroup;
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
    } while (yield UserService.duplicateId(result));
    return result;
});
// 그룹 나가기
const leaveGroup = (userId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const group = yield prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });
        if (!group) {
            throw new Error('Group not found');
        }
        // user가 나가는지 groupOwner가 나가는지
        if (group.groupOwner === userId) {
            // groupOwner가 나가면 group 걍 사라짐
            yield prisma.group.delete({
                where: {
                    id: groupId,
                },
            });
        }
        else {
            // 일반 user가 나가면 그룹 탈퇴로 적용
            yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    groupId: undefined, // 또는 원하는 값으로 갱신
                },
            });
        }
    }
    catch (error) {
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.leaveGroup = leaveGroup;
// 그룹 받기
const getGroup = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return (_a = user.groupId) !== null && _a !== void 0 ? _a : null;
    }
    catch (error) {
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getGroup = getGroup;
//# sourceMappingURL=GroupService.js.map