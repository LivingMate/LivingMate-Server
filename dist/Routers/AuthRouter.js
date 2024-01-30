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
exports.AuthRouter = void 0;
//import { body } from 'express-validator';
//import { AuthController } from '../Controllers';
const passport_1 = __importDefault(require("passport"));
const UserController = __importStar(require("../Controllers/UserController"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
// import GoogleStrategy from "passport-google-oauth20";
const UserServiceUtils = __importStar(require("../Services/User/UserServiceUtils"));
const UserService = __importStar(require("../Services/User/UserService"));
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient;
const AuthRouter = express_1.default.Router();
exports.AuthRouter = AuthRouter;
passport_1.default.serializeUser((user, done) => {
    done(null, { id: user.id, groupId: user.groupId });
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(id);
        // If you need groupId in the user object, you can assign it here
        user.groupId = user.groupId;
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
const isLoggedIn = (req, res, next) => {
    // passport의 isAuthenticated 메소드를 이용하여 사용자가 로그인되어 있는지 확인
    if (req.isAuthenticated()) {
        // 로그인되어 있다면 다음 미들웨어로 이동
        return next();
    }
    // 로그인되어 있지 않다면 로그인 페이지로 리다이렉트 
    res.redirect('/login');
};
const googleStrategy = () => __awaiter(void 0, void 0, void 0, function* () {
    return passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile'],
        passReqToCallback: true
    }, (req, accessToken, refreshToken, params, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('google profile : ', profile);
        try {
            if (req.user) { //logged-in user
                const existingUser = yield UserServiceUtils.findUserById(profile.id);
                if (existingUser && (existingUser.id !== req.user.id)) {
                    throw new Error('There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
                    //return done(null, existingUser); 
                }
                const user = yield UserServiceUtils.findUserById(req.user.id);
                return done(null, user);
            }
            //login 안 한 경우
            const existingUser = yield UserServiceUtils.findUserById(profile.id);
            if (existingUser) {
                return done(null, existingUser);
            }
            else {
                const signUpUser = yield UserService.createUser({
                    email: profile.emails[0].value,
                    groupId: "aaaaaa",
                    userName: profile.displayName,
                    //sex: profile._json.gender,
                    sex: false,
                    age: profile.age
                });
                return done(null, signUpUser);
            }
            // user.tokens.push({
            //   kind: 'google',
            //   accessToken,
            //   accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
            //   refreshToken,
            // });
        }
        catch (err) {
            return done(err);
        }
    })));
});
//passport.use('google', googleStrategy);
// router.get('/google', passport.authenticate('google', {scope:['profile', 'email']}));
AuthRouter.get('/auth/google/callback', passport_1.default.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/login', failureFlash: true
}));
AuthRouter.get('/auth/logout', function (req, res, next) {
    // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});
//export default router;
AuthRouter.get('/signup', UserController.createUser);
AuthRouter.get('/profile/:userId', UserController.getUserProfile);
// AuthRouter.get('/logout',isLoggedIn, (req,res)=>{
//     req.logout();
//     req.session.destroy('/');
// });
AuthRouter.get('/google', passport_1.default.authenticate('google'));
//# sourceMappingURL=AuthRouter.js.map