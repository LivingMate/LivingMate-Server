// import passport from "passport";
// import GoogleStrategy from "passport-google-oauth20";
// import * as UserService from "../src/Services/UserService";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();


// passport.serializeUser((user:any, done) => {
//     done(null, {id: user.id, groupId: user.groupId});
// });


// passport.deserializeUser(async (id:string, done) => {
//   try {
//     const user = await UserService.findUserById(id);
//     // If you need groupId in the user object, you can assign it here
//     user.groupId = user.groupId;
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });



// const googleStrategy = new GoogleStrategy({
//     clientID: process.env.GOOGLE_ID,
//     clientSecret: process.env.GOOGLE_SECRET,
//     callbackURL: '/auth/google/callback',
//     scope: ['email', 'profile' ],
//     passReqToCallback: true
//   }, async (req, profile, done) => {
//     try {
//       if (req.user) { //logged-in user

//         const existingUser = await UserService.findUserById(profile.id);


//         if (existingUser && (existingUser.id !== req.user.id)) {
//           throw new Error('There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
//           //return done(null, existingUser);
//         }

//         const user = await UserService.findUserById(req.user.id);
//         return done(null, user);
//       }

//       //login 안 한 경우
//       const existingUser = await UserService.findUserById(profile.id);
//       if (existingUser) {
//         return done(null, existingUser);
//       }

//       else{
//         const signUpUser = await UserService.createUser({
//           email: profile.emails[0].value,
//           groupId: "aaaaaa",
//           userName: profile.displayName,
//           sex: profile._json.gender,
//           age: profile.age
//         })
//         return done(null, signUpUser);
//       }

      
//       // user.tokens.push({
//       //   kind: 'google',
//       //   accessToken,
//       //   accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
//       //   refreshToken,
//       // });
      
     

//     } catch (err) {
//       return done(err);
//     }
//   });
  

