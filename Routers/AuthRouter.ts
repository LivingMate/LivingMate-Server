import { Router } from 'express';
import { body } from 'express-validator';
//import { AuthController } from '../Controllers';
import {passport} from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const router:Router = Router();

router.get('/google', passport.authenticate('google', {scope:['profile', 'email']}));

router.get('/google/callback',
passport.authenticate('google', 
{successRedirect: '/',
failureRedirect: '/auth/login',
failureFlash: true
}))

/*{failureRedirect: '/'}),
(req,res) =>{
    res.redirect('/');},
);*/

/*
router.get('/logout', isLoggedIn, (req, res) => {
    // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
    req.logout();
    req.session.destroy(); // 로그인인증 수단으로 사용한 세션쿠키를 지우고 파괴한다. 세션쿠키가 없다는 말은 즉 로그아웃 인 말.
    res.redirect('/');
 });
 */