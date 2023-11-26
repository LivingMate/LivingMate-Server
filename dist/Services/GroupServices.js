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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGroupMembersColorsByGroupId = exports.findGroupMembersNamesByGroupId = exports.findGroupNameByGroupId = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient;
var findGroupNameByGroupId = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.group.findUnique({
                    where: {
                        id: groupId
                    },
                    select: {
                        groupName: true
                    }
                })];
            case 1:
                groupName = _a.sent();
                if (!groupName) {
                    throw new Error('groupName not found!');
                }
                return [2 /*return*/, groupName];
        }
    });
}); };
exports.findGroupNameByGroupId = findGroupNameByGroupId;
var findGroupMembersNamesByGroupId = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupMembers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findMany({
                    where: { groupId: groupId },
                    select: {
                        userName: true,
                        //userColor:true 
                    }
                })
                //(이하 3줄: 각 property를 받아서 객체로 반환하는 방법 -> DTO 타입 맞추기 실패)
                // const memberNames = groupMembers.map(member => member.userName); 
                // const memberColors = groupMembers.map(member => member.userColor);
                // return {memberNames, memberColors};
                //(이하 4줄: 비슷함. 얘도 DTO 타입 맞추기 실패)
                // return groupMembers.map(member => ({
                //     userName: member.userName,
                //     userColor: member.userColor
                // }));
            ];
            case 1:
                groupMembers = _a.sent();
                //(이하 3줄: 각 property를 받아서 객체로 반환하는 방법 -> DTO 타입 맞추기 실패)
                // const memberNames = groupMembers.map(member => member.userName); 
                // const memberColors = groupMembers.map(member => member.userColor);
                // return {memberNames, memberColors};
                //(이하 4줄: 비슷함. 얘도 DTO 타입 맞추기 실패)
                // return groupMembers.map(member => ({
                //     userName: member.userName,
                //     userColor: member.userColor
                // }));
                return [2 /*return*/, groupMembers.map(function (member) { return member.userName; })]; //이름만 묶어서 array로 반환하는 버전 
        }
    });
}); };
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
var findGroupMembersColorsByGroupId = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupMembers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findMany({
                    where: { groupId: groupId },
                    select: {
                        userColor: true,
                    }
                })];
            case 1:
                groupMembers = _a.sent();
                return [2 /*return*/, groupMembers.map(function (member) { return member.userColor; })]; //컬러만 묶어서 array로 반환하는 버전 
        }
    });
}); };
exports.findGroupMembersColorsByGroupId = findGroupMembersColorsByGroupId;
//멤버 이름과 컬러를 따로 받는 방법의 문제점: 순서가 그대로일지.. 모름... 색이 서로 바뀔 수도 있음. 
var addUserToGroup = function (signupDTO, groupId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
//# sourceMappingURL=GroupServices.js.map