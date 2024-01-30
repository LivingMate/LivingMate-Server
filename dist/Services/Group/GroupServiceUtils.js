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
exports.findGroupMembersColorsByGroupId = exports.findGroupMembersNamesColorsByGroupId = exports.findGroupNameByGroupId = exports.checkJoinedGroupId = exports.checkForbiddenGroup = exports.findGroupById = exports.findGroupByGroupId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// groupID로 groupName찾기
const findGroupByGroupId = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });
        if (data) {
            return data.groupName;
        }
        else {
            return 'error';
        }
    }
    catch (error) {
        console.error('error :: group/GroupServiceUtils/findGroupByGroupId', error);
        throw error;
    }
});
exports.findGroupByGroupId = findGroupByGroupId;
// groupId로 group찾기
const findGroupById = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield prisma.group.findUnique({
        where: {
            id: groupId,
        },
    });
    if (!group) {
        throw new Error('No group found with the given groupId');
    }
    return group;
});
exports.findGroupById = findGroupById;
// 유효한 그룹인지 확인
const checkForbiddenGroup = (userGroupId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userGroupId !== groupId) {
        throw new Error('Forbidden Group');
    }
});
exports.checkForbiddenGroup = checkForbiddenGroup;
// join된 그룹인지 확인하기
const checkJoinedGroupId = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingGroup = yield prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });
        if (!existingGroup) {
            throw new Error('Joined Group');
        }
    }
    catch (error) {
        throw error;
    }
});
exports.checkJoinedGroupId = checkJoinedGroupId;
const findGroupNameByGroupId = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupName = yield prisma.group.findUnique({
        where: {
            id: groupId,
        },
        select: {
            groupName: true,
        },
    });
    if (!groupName) {
        throw new Error('groupName not found!');
    }
    return groupName;
});
exports.findGroupNameByGroupId = findGroupNameByGroupId;
const findGroupMembersNamesColorsByGroupId = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupMembers = yield prisma.user.findMany({
        where: { groupId: groupId },
        select: {
            userName: true,
            userColor: true,
        },
    });
    return groupMembers;
});
exports.findGroupMembersNamesColorsByGroupId = findGroupMembersNamesColorsByGroupId;
const findGroupMembersColorsByGroupId = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupMembers = yield prisma.user.findMany({
        where: { groupId: groupId },
        select: {
            userColor: true,
        },
    });
    return groupMembers.map((member) => member.userColor); //컬러만 묶어서 array로 반환하는 버전
});
exports.findGroupMembersColorsByGroupId = findGroupMembersColorsByGroupId;
//# sourceMappingURL=GroupServiceUtils.js.map