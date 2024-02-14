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
exports.login = exports.signup = void 0;
const express_validator_1 = require("express-validator");
const jwtHandler_1 = require("../Middleware/jwtHandler");
const message_1 = __importDefault(require("../modules/message"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const util_1 = __importDefault(require("../modules/util"));
const AuthService = __importStar(require("../Services/AuthService"));
const UserService = __importStar(require("../Services/User/UserService"));
// POST /auth/signup
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const signupDto = req.body;
    try {
        const data = yield UserService.createUser(signupDto);
        const accessToken = (0, jwtHandler_1.getToken)(data.userId);
        return res
            .status(statusCode_1.default.CREATED)
            .send(util_1.default.success(statusCode_1.default.CREATED, message_1.default.SIGNUP_SUCCESS, accessToken));
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
//login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(statusCode_1.default.BAD_REQUEST)
            .send(util_1.default.fail(statusCode_1.default.BAD_REQUEST, message_1.default.BAD_REQUEST));
    }
    const LoginDto = req.body;
    try {
        const data = yield AuthService.login(LoginDto);
        const accessToken = (0, jwtHandler_1.getToken)(data.userId);
        return res
            .status(statusCode_1.default.OK)
            .send(util_1.default.success(statusCode_1.default.OK, message_1.default.LOGIN_SUCCESS, accessToken));
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
//# sourceMappingURL=AuthController.js.map