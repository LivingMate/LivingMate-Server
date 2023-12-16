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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient;
const google = () => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('google profile : ', profile);
        try {
            const exUser = yield prisma.user.findUnique({
                where: { email: profile.email },
            });
            // 이미 가입된 구글 프로필이면 성공
            if (exUser) {
                done(null, exUser); // 로그인 인증 완료
            }
            else {
                // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                const newUser = yield prisma.user.create({
                    data: {
                        email: profile === null || profile === void 0 ? void 0 : profile.email[0].value,
                        userName: profile.displayName,
                        userColor: 'FFFFFF',
                        sex: profile.sex,
                        age: profile.age,
                    }
                });
                done(null, newUser); // 회원가입하고 로그인 인증 완료
            }
        }
        catch (error) {
            console.error(error);
            done(error);
        }
    })));
});
exports.default = google;
/*
module.exports = () => {

   passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
    prisma.user.findUnique({
        where:{
            id:id,
        }
    }).then (user=>done(null,user))
    .catch(err=>done(err))
   });

   
   google(); // 구글 전략 등록
};
*/ 
//# sourceMappingURL=googleStrategy.js.map