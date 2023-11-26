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
var client_1 = require("@prisma/client");
var GroupServices_1 = require("../GroupServices");
var GroupServices_2 = require("../GroupServices");
var prisma = new client_1.PrismaClient;
var CreateUser = function (signupDtO) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.create({
                    data: {
                        userName: signupDtO.userName,
                        userColor: "FFFFFF",
                        email: signupDtO.email,
                        sex: signupDtO.sex,
                        age: signupDtO.age,
                    },
                })
                //if 이미 존재하는 유저인지 확인
            ];
            case 1:
                user = _a.sent();
                //if 이미 존재하는 유저인지 확인
                return [2 /*return*/, user];
        }
    });
}); };
var getUserProfile = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var userProfile, userGroupName, groupName, userGroupMembersNames, groupMembersNames, userGroupMembersColors, groupMembersColors, data, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, findUserById(userId)];
            case 1:
                userProfile = _b.sent();
                if (!userProfile) {
                    throw new Error('User Not Found!');
                }
                if (userProfile.groupId === null || userProfile.groupId === undefined) {
                    throw new Error('User has no group!');
                }
                return [4 /*yield*/, (0, GroupServices_1.findGroupNameByGroupId)(userProfile.groupId)];
            case 2:
                userGroupName = _b.sent();
                groupName = (_a = userGroupName === null || userGroupName === void 0 ? void 0 : userGroupName.groupName) !== null && _a !== void 0 ? _a : 'DefaultGroupName';
                return [4 /*yield*/, (0, GroupServices_2.findGroupMembersNamesByGroupId)(userProfile.groupId)];
            case 3:
                userGroupMembersNames = _b.sent();
                groupMembersNames = userGroupMembersNames !== null && userGroupMembersNames !== void 0 ? userGroupMembersNames : [];
                return [4 /*yield*/, (0, GroupServices_1.findGroupMembersColorsByGroupId)(userProfile.groupId)];
            case 4:
                userGroupMembersColors = _b.sent();
                groupMembersColors = userGroupMembersColors !== null && userGroupMembersColors !== void 0 ? userGroupMembersColors : [];
                data = {
                    userName: userProfile.userName,
                    userColor: userProfile.userColor,
                    groupName: groupName,
                    groupMembersNames: groupMembersNames,
                    groupMembersColors: groupMembersColors,
                    //prisma return 값이 object라서 생기는 문제. 얘의 멤버변수를 참조하면 되는데, groupMembers는 object로 이루어진 array라서 고민됨
                    // 해결 
                };
                return [2 /*return*/, data];
            case 5:
                error_1 = _b.sent();
                throw error_1;
            case 6: return [2 /*return*/];
        }
    });
}); };
var findUserById = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findUnique({
                    where: {
                        id: userId,
                    }
                })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new Error('User not found!'); //임시
                }
                return [2 /*return*/, user];
        }
    });
}); };
var findGroupIdByUserId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var group;
    return __generator(this, function (_a) {
        group = prisma.user.findUnique({
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
        return [2 /*return*/, group];
    });
}); };
var findUserByIdAndUpdate = function (userId, userUpdateRequestDto) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        userName: userUpdateRequestDto.userName,
                        userColor: userUpdateRequestDto.userColor,
                    },
                })];
            case 1:
                updatedUser = _a.sent();
                return [2 /*return*/, updatedUser];
        }
    });
}); };
//+ 그룹 참여하는 서비스도 만들어야 함. 
exports.default = {
    findUserById: findUserById,
    findGroupIdByUserId: findGroupIdByUserId,
    findUserByIdAndUpdate: findUserByIdAndUpdate,
    getUserProfile: getUserProfile
};
//# sourceMappingURL=UserServices.js.map