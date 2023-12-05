const passport = require('passport');
import {PrismaClient} from '@prisma/client';
import { UserService } from '../Services';
const google = require('./googleStrategy');

const prisma = new PrismaClient;

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