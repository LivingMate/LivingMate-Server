"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { AuthController } from '../Controllers';
const passport_1 = require("passport");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/google', passport_1.passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.passport.authenticate('google', { successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));
/*{failureRedirect: '/'}),
(req,res) =>{
    res.redirect('/');},
);*/
/*
router.get('/auth/logout', (req, res) => {
    // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
    req.logout();
    res.redirect('/auth/login');
 });
 */
exports.default = router;
//# sourceMappingURL=AuthRouter.js.map