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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorGenerator_1 = __importDefault(require("../../error/errorGenerator"));
const message_1 = __importDefault(require("../modules/message"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
const prisma = new client_1.PrismaClient();
const login = (loginDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: loginDto.email
            }
        });
        if (!user)
            throw (0, errorGenerator_1.default)({
                msg: message_1.default.NOT_FOUND_USER_EMAIL,
                statusCode: statusCode_1.default.NOT_FOUND
            });
        const isMatch = yield bcrypt_1.default.compare(loginDto.password, user.password);
        if (!isMatch)
            throw (0, errorGenerator_1.default)({
                msg: message_1.default.INVALID_PASSWORD,
                statusCode: statusCode_1.default.UNAUTHORIZED
            });
        /*
      const isGroupped = await GroupServiceUtils.findGroupIdByUserId(user.id);
      if (isGroupped == "aaaaaa"){
        throw errorGenerator({
          msg:
        })
  
      }*/
        const data = {
            userId: user.id
        };
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.login = login;
//# sourceMappingURL=AuthService.js.map