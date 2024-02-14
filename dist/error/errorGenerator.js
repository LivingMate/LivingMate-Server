"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __importDefault(require("../src/modules/message"));
const DEFAULT_HTTP_STATUS_MESSAGES = {
    400: message_1.default.BAD_REQUEST,
    401: message_1.default.UNAUTHORIZED,
    403: message_1.default.FORBIDDEN,
    404: message_1.default.NOT_FOUND,
    409: message_1.default.DUPLICATED,
    500: message_1.default.INTERNAL_SERVER_ERROR,
    503: message_1.default.TEMPORARY_UNAVAILABLE,
    600: message_1.default.DB_ERROR
};
const errorGenerator = ({ msg = message_1.default.INTERNAL_SERVER_ERROR, statusCode = 500 }) => {
    // 인자로 들어오는 메세지와 상태 코드를 매핑
    const err = new Error(msg || DEFAULT_HTTP_STATUS_MESSAGES[statusCode]);
    err.statusCode = statusCode;
    throw err;
};
exports.default = errorGenerator;
//# sourceMappingURL=errorGenerator.js.map