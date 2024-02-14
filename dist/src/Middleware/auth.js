"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const errorGenerator_1 = __importDefault(require("../../error/errorGenerator"));
const message_1 = __importDefault(require("../modules/message"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
exports.default = (req, res, next) => {
    var _a;
    // request-header 에서 토큰 받아오기
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ').reverse()[0];
    // 토큰 유뮤 검증
    if (!token) {
        throw (0, errorGenerator_1.default)({
            msg: message_1.default.NULL_VALUE_TOKEN,
            statusCode: statusCode_1.default.UNAUTHORIZED
        });
    }
    // 토큰 검증
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        req.body.user = decoded.user;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw (0, errorGenerator_1.default)({
                msg: message_1.default.EXPIRED_TOKEN,
                statusCode: statusCode_1.default.UNAUTHORIZED
            });
        }
        throw (0, errorGenerator_1.default)({
            msg: message_1.default.INVALID_TOKEN,
            statusCode: statusCode_1.default.UNAUTHORIZED
        });
    }
};
//# sourceMappingURL=auth.js.map