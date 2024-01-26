"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = {
    success: (code, message, data) => ({
        code,
        message,
        data,
    }),
    fail: (code, message) => ({
        code,
        message,
    }),
};
exports.default = util;
//# sourceMappingURL=util.js.map