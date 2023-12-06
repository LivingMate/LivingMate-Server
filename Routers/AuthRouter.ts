
import { body } from 'express-validator';
//import { AuthController } from '../Controllers';
import {passport} from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Router, Request, Response } from "express";


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


router.get('/auth/logout', (req, res) => {
    // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
    req.logout();
    res.redirect('/auth/login');
 });
 