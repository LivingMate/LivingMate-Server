"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const client_1 = require("@prisma/client");
const googleStrategy_1 = __importDefault(require("./googleStrategy"));
const prisma = new client_1.PrismaClient;
module.exports = () => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => {
        prisma.user.findUnique({
            where: {
                id: id,
            }
        }).then(user => done(null, user))
            .catch(err => done(err));
    });
    (0, googleStrategy_1.default)(); // 구글 전략 등록
};
//# sourceMappingURL=index.js.map