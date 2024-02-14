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
exports.quitUser = exports.getUserNotiState = exports.getUserSet = exports.getAllMember = exports.getUserProfile = exports.userNotiYesNo = exports.userSetUpdate = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const UserService = __importStar(require("../Services/User/UserService"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const message_1 = __importDefault(require("../modules/message"));
const util_1 = __importDefault(require("../modules/util"));
// POST
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const signupDto = req.body;
    try {
        const data = yield UserService.createUser(signupDto);
        console.log(data);
        res.status(201).send(data);
    }
    catch (error) {
        console.error('Error creating user: controller', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createUser = createUser;
// PATCH
const userSetUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const userId = req.body.user.id;
    const userUpdateRequestDto = req.body;
    try {
        const data = yield UserService.userSetUpdate(userId, userUpdateRequestDto);
        console.log(data);
        return res.status(statusCode_1.default.OK).send(util_1.default.success(statusCode_1.default.OK, message_1.default.UPDATE_USER_SUCCESS, data));
    }
    catch (error) {
        console.error('Error creating user: controller', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.userSetUpdate = userSetUpdate;
const userNotiYesNo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(statusCode_1.default.BAD_REQUEST).send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const userId = req.body.user.id;
    const notificationState = req.body.notificationState;
    try {
        const data = yield UserService.notiYesNo(userId, notificationState);
        console.log(data);
        res.status(201).send(util_1.default.success(statusCode_1.default.OK, message_1.default.UPDATE_USER_NOTIFICATION_STATE_SUCCESS, data));
    }
    catch (error) {
        console.error('Error user noti changing: controller', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.userNotiYesNo = userNotiYesNo;
const quitUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    try {
        const data = yield UserService.quitUser(userId);
        console.log(data);
        res.status(201).send(util_1.default.success(statusCode_1.default.OK, message_1.default.DELETE_USER_SUCCESS));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error quiting user in Controller:', error.message);
            res.status(500).json({ error: 'Error quiting user in Controller' });
        }
        else {
            console.error('Unknown error quiting user in Controller:', error);
            res.status(500).json({ error: 'Unknown error quiting user in Controller' });
        }
    }
});
exports.quitUser = quitUser;
// GET
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    try {
        const data = yield UserService.getUserProfile(userId);
        res.status(201).send(util_1.default.success(statusCode_1.default.OK, message_1.default.READ_MYPAGE_SUCCESS, data));
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting user profile: Controller' });
    }
});
exports.getUserProfile = getUserProfile;
const getAllMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    try {
        const data = yield UserService.getAllMember(userId);
        res.status(201).send(util_1.default.success(statusCode_1.default.OK, message_1.default.READ_MEMBERS_SUCCESS, data));
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting user member: Controller' });
    }
});
exports.getAllMember = getAllMember;
const getUserSet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    try {
        const data = yield UserService.userSetGet(userId);
        res.status(201).send(util_1.default.success(statusCode_1.default.OK, message_1.default.READ_USER_SUCCESS, data));
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting user setting: Controller' });
    }
});
exports.getUserSet = getUserSet;
const getUserNotiState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user.id;
    try {
        const data = yield UserService.getUserNotiState(userId);
        console.log(data);
        res.status(201).send(util_1.default.success(statusCode_1.default.OK, message_1.default.READ_USER_NOTIFICATION_SUCCESS, data));
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting user notiState: Controller' });
    }
});
exports.getUserNotiState = getUserNotiState;
//# sourceMappingURL=UserController.js.map