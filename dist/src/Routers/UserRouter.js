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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../Middleware/auth"));
const UserController = __importStar(require("../Controllers/UserController"));
const UserRouter = express_1.default.Router();
exports.UserRouter = UserRouter;
UserRouter.patch('/user/update/setting', auth_1.default, UserController.userSetUpdate);
UserRouter.patch('/user/update/setting/notification', auth_1.default, UserController.userNotiYesNo);
UserRouter.patch('/user/leave', auth_1.default, UserController.quitUser);
UserRouter.get('/user/mypage', auth_1.default, UserController.getUserProfile);
UserRouter.get('/user/all', auth_1.default, UserController.getAllMember);
UserRouter.get('/user/setting', auth_1.default, UserController.getUserSet);
UserRouter.get('/user/setting/notification', auth_1.default, UserController.getUserNotiState);
//# sourceMappingURL=UserRouter.js.map