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
exports.addUserToGroup = exports.getUserProfile = exports.findUserByIdAndUpdate = exports.findGroupIdByUserId = exports.findUserById = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const GroupService = __importStar(require("./GroupService"));
const prisma = new client_1.PrismaClient;
const createUser = (signupDtO) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.create({
        data: {
            userName: signupDtO.userName,
            userColor: "FFFFFF", //default, just temporary value for now
            email: signupDtO.email,
            sex: signupDtO.sex,
            age: signupDtO.age,
        },
    });
    //if 이미 존재하는 유저인지 확인
    return user;
});
exports.createUser = createUser;
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userProfile = yield findUserById(userId);
        if (!userProfile) {
            throw new Error('User Not Found!');
        }
        if (userProfile.groupId === null || userProfile.groupId === undefined) {
            throw new Error('User has no group!');
        }
        const userGroupName = yield GroupService.findGroupNameByGroupId(userProfile.groupId);
        const groupName = (_a = userGroupName === null || userGroupName === void 0 ? void 0 : userGroupName.groupName) !== null && _a !== void 0 ? _a : 'DefaultGroupName';
        const userGroupMembersNames = yield GroupService.findGroupMembersNamesByGroupId(userProfile.groupId);
        const groupMembersNames = userGroupMembersNames !== null && userGroupMembersNames !== void 0 ? userGroupMembersNames : [];
        const userGroupMembersColors = yield GroupService.findGroupMembersColorsByGroupId(userProfile.groupId);
        const groupMembersColors = userGroupMembersColors !== null && userGroupMembersColors !== void 0 ? userGroupMembersColors : [];
        const data = {
            userName: userProfile.userName,
            userColor: userProfile.userColor,
            groupName,
            groupMembersNames,
            groupMembersColors,
        };
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserProfile = getUserProfile;
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: userId,
        }
    });
    if (!user) {
        throw new Error('User not found!'); //임시
    }
    return user;
});
exports.findUserById = findUserById;
const findGroupIdByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            groupId: true,
        },
    });
    if (!group) {
        throw new Error('Group not found!');
    }
    return group;
});
exports.findGroupIdByUserId = findGroupIdByUserId;
const findUserByIdAndUpdate = (userId, userUpdateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            userName: userUpdateRequestDto.userName,
            userColor: userUpdateRequestDto.userColor,
        },
    });
    return updatedUser;
});
exports.findUserByIdAndUpdate = findUserByIdAndUpdate;
//+ 그룹 참여하는 서비스
const addUserToGroup = (signupDTO, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    //1. createUser with signupDTO
    //2. put her groupId in her record at User table
    //3. assign her id(? not sure) to Group's User[]? Did it mean it had foreign relations with the table?
    const newUser = yield createUser(signupDTO);
    yield prisma.user.update({
        where: {
            id: newUser.id,
        },
        data: {
            groupId: groupId,
        }
    });
    return newUser;
});
exports.addUserToGroup = addUserToGroup;
//# sourceMappingURL=UserService.js.map