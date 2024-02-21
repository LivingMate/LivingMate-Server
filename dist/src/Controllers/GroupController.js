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
exports.getGroupId = exports.leaveGroup = exports.updateGroupName = exports.goGroup = exports.createGroup = void 0;
const GroupService = __importStar(require("../Services/Group/GroupService"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const message_1 = __importDefault(require("../modules/message"));
const util_1 = __importDefault(require("../modules/util"));
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupName = req.body.groupName;
    try {
        const data = yield GroupService.createGroup(userId, groupName);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.CREATE_GROUP_SUCCESS));
    }
    catch (error) {
        console.error('Error at creating Group: Controller', error);
        res.status(500).json({ error: 'Error creating Group: Controller' });
    }
});
exports.createGroup = createGroup;
const goGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupId = req.body.groupId;
    try {
        const data = yield GroupService.goGroup(userId, groupId);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.JOIN_GROUP_SUCCESS));
    }
    catch (error) {
        console.error('Error at entering Group: Controller', error);
        res.status(500).json({ error: 'Error creating Group: Controller' });
    }
});
exports.goGroup = goGroup;
const updateGroupName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    const groupName = req.body.groupName;
    try {
        const data = yield GroupService.updateGroupName(userId, groupName);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.UPDATE_GROUP_SUCCESS, data));
    }
    catch (error) {
        console.error('Error at entering Group: Controller', error);
        res.status(500).json({ error: 'Error creating Group: Controller' });
    }
});
exports.updateGroupName = updateGroupName;
// const leaveGroup
const leaveGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    try {
        const data = yield GroupService.leaveGroup(userId);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.LEAVE_GROUP_SUCCESS, data));
    }
    catch (error) {
        console.error('Error at leaving Group: Controller', error);
        res.status(500).json({ error: 'Error leaving Group: Controller' });
    }
});
exports.leaveGroup = leaveGroup;
// groupId get해주기 
const getGroupId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    try {
        const data = yield GroupService.getIdandName(userId);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.INVITATION_GROUP_SUCCESS, data));
    }
    catch (error) {
        console.error('Error at getting GroupId : Controller', error);
        res.status(500).json({ error: 'Error getting GroupId: Controller' });
    }
});
exports.getGroupId = getGroupId;
//# sourceMappingURL=GroupController.js.map