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
exports.getGroup = exports.findGroupMembersColorsByGroupId = exports.findGroupMembersNamesByGroupId = exports.findGroupNameByGroupId = exports.leaveGroup = exports.createGroup = exports.checkJoinedGroupId = exports.checkForbiddenGroup = exports.findGroupById = exports.findUserById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// userId로 user 찾기
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new Error('No user found with the given userId');
    }
    return user;
});
exports.findUserById = findUserById;
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
const checkForbiddenGroup = (userGroupId, GroupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userGroup = yield prisma.group.findUnique({
            where: {
                id: userGroupId,
            },
        });
        if (!userGroup || userGroup.id !== GroupId) {
            throw new Error('Forbidden Room');
        }
    }
    catch (error) {
        throw error;
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
// createGroup
const createGroup = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield findUserById(userId);
        yield checkJoinedGroupId((user === null || user === void 0 ? void 0 : user.groupId) || '');
        const createdGroup = yield prisma.group.create({
            data: {
                groupOwner: userId,
                groupCode: user.groupId,
                groupName: '',
                groupSpending: 0,
            },
        });
        const data = {
            _id: createdGroup.id,
            groupCode: createdGroup.groupCode,
        };
        return data;
    }
    catch (error) {
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.createGroup = createGroup;
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
                    groupId: null,
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
const findGroupMembersNamesByGroupId = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupMembers = yield prisma.user.findMany({
        where: { groupId: groupId },
        select: {
            userName: true,
            //userColor:true
        },
    });
    //(이하 3줄: 각 property를 받아서 객체로 반환하는 방법 -> DTO 타입 맞추기 실패)
    // const memberNames = groupMembers.map(member => member.userName);
    // const memberColors = groupMembers.map(member => member.userColor);
    // return {memberNames, memberColors};
    //(이하 4줄: 비슷함. 얘도 DTO 타입 맞추기 실패)
    // return groupMembers.map(member => ({
    //     userName: member.userName,
    //     userColor: member.userColor
    // }));
    return groupMembers.map((member) => member.userName); //이름만 묶어서 array로 반환하는 버전
});
exports.findGroupMembersNamesByGroupId = findGroupMembersNamesByGroupId;
//return groupMembers 하면 나오는 모양:
// [
//     {
//         userName: 'User 1',
//         userColor: 'Color 1'
//     },
//     {
//         userName: 'User 2',
//         userColor: 'Color 2'
//     },
//     // ...other user objects
// ]
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
//멤버 이름과 컬러를 따로 받는 방법의 문제점: 순서가 그대로일지.. 모름... 색이 서로 바뀔 수도 있음.
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