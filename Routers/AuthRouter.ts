import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../Controllers';
import {passport} from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const router:Router = Router();

router.get('/google', passport.authenticate('google', {scope:['profile', 'email']}));

router.get('/google/callback',passport.authenticate('google', {failureRedirect: '/'}),
            (req,res) =>{
                res.redirect('/');
            },
);