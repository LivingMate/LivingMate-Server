"use strict";
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
const client_1 = require("@prisma/client");
const index_1 = require("./index");
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
        const userGroupName = yield index_1.GroupService.findGroupNameByGroupId(userProfile.groupId);
        const groupName = (_a = userGroupName === null || userGroupName === void 0 ? void 0 : userGroupName.groupName) !== null && _a !== void 0 ? _a : 'DefaultGroupName';
        const userGroupMembersNames = yield index_1.GroupService.findGroupMembersNamesByGroupId(userProfile.groupId);
        const groupMembersNames = userGroupMembersNames !== null && userGroupMembersNames !== void 0 ? userGroupMembersNames : [];
        const userGroupMembersColors = yield index_1.GroupService.findGroupMembersColorsByGroupId(userProfile.groupId);
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
exports.default = {
    createUser,
    findUserById,
    findGroupIdByUserId,
    findUserByIdAndUpdate,
    getUserProfile
};
//# sourceMappingURL=UserService.js.map