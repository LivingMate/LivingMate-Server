// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import {PrismaClient} from '@prisma/client';
// import * as UserService from "../Services/UserService";

// const prisma = new PrismaClient;


// const google = async() => {
//    passport.use(
//       new GoogleStrategy(
//          {
//             clientID: process.env.GOOGLE_ID, 
//             clientSecret: process.env.GOOGLE_SECRET,
//             callbackURL: '/auth/google/callback',
//          },
//          async (accessToken, refreshToken, profile, done) => {
//             console.log('google profile : ', profile);
//             try {
//                const exUser = await prisma.user.findUnique({
//                   where: { email: profile.email},
//                });
//                // 이미 가입된 구글 프로필이면 성공
//                if (exUser) {
//                   done(null, exUser); // 로그인 인증 완료
//                } else {
//                   // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
//                   const newUser = await prisma.user.create({
//                     data:{
//                         email: profile?.email[0].value,
//                         userName: profile.displayName,
//                         userColor: 'FFFFFF', 
//                         sex: profile.sex,
//                         age: profile.age,
//                     }
//                   });
//                   done(null, newUser); // 회원가입하고 로그인 인증 완료
//                }
//             } catch (error) {
//                console.error(error);
//                done(error);
//             }
//          },
//       ),
//    );
// };


// export default google;


// /*
// module.exports = () => {

//    passport.serializeUser((user, done) => {
//       done(null, user.id);
//    });

//    passport.deserializeUser((id, done) => {
//     prisma.user.findUnique({
//         where:{
//             id:id,
//         }
//     }).then (user=>done(null,user))
//     .catch(err=>done(err))
//    }); 

   
//    google(); // 구글 전략 등록
// };
// */