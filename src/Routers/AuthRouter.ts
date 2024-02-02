import { Router } from 'express';
//import { body } from 'express-validator/check';
import * as AuthController from '../Controllers/AuthController';

const AuthRouter: Router = Router();

AuthRouter.post(
  '/signup',
  /*
  [
    body('email').isEmail(),
    body('password').not().isEmpty(),
    body('userName').not().isEmpty(),
    body('sex').not().isEmpty(),
  ],*/
  AuthController.signup
);

AuthRouter.post(
  '/login',/*
  [
    body('email').isEmail(),
    body('password').not().isEmpty(),
    body('fcmToken').not().isEmpty()
  ],
*/
  AuthController.login

);

export {AuthRouter}




/*
passport.serializeUser((user:any, done) => {
    done(null, {id: user.id, groupId: user.groupId});
});


passport.deserializeUser(async (id:string, done) => {
  try {
    const user = await UserServiceUtils.findUserById(id);
    // If you need groupId in the user object, you can assign it here
    user.groupId = user.groupId;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const isLoggedIn = (req:Request, res:Response, next:NextFunction) => {
    // passport의 isAuthenticated 메소드를 이용하여 사용자가 로그인되어 있는지 확인
    if (req.isAuthenticated()) {
      // 로그인되어 있다면 다음 미들웨어로 이동
      return next();
    }
  
    // 로그인되어 있지 않다면 로그인 페이지로 리다이렉트 
    res.redirect('/login');
};

*/



// const googleStrategy = async()=>passport.use(
//     new GoogleStrategy(
//         {
//             clietID: process.env.GOOGLE_ID,
//             clientSecret: process.env.GOOGLE_SECRET,
//             callbackURL: '/auth/google/callback',
//             scope: ['email', 'profile'],
//             passReqToCallback: true
//         }, async (req: any, accessToken: any, refreshToken: any, params: any, profile: any, done: any) => {
//             console.log('google profile : ', profile);
//              try {
//                 if (req.user) { //logged-in user
//                     const existingUser = await UserServiceUtils.findUserById(profile.id);
                    
//                     if (existingUser && (existingUser.id !== req.user.id)) {
//                         throw new Error('There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
//                         //return done(null, existingUser); 
//                     }

//                 const user = await UserServiceUtils.findUserById(req.user.id);
//         return done(null, user);
//       }

//       //login 안 한 경우
//       const existingUser = await UserServiceUtils.findUserById(profile.id);
//       if (existingUser) {
//         return done(null, existingUser);
//       }

//       else{
        
//         const signUpUser = await UserService.createUser({
//           email: profile.emails[0].value,
//           groupId: "aaaaaa",
//           userName: profile.displayName,
//           //sex: profile._json.gender,
//           sex: false,
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
//   }));

  //passport.use('google', googleStrategy);




  

// router.get('/google', passport.authenticate('google', {scope:['profile', 'email']}));

/*
AuthRouter.get('/auth/google/callback',
    passport.authenticate('google', {successRedirect: '/', failureRedirect: '/auth/login', failureFlash: true
}))




AuthRouter.get('/auth/logout', function(req, res, next) {
    // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
    req.logout(function(err){
        if(err) {return next(err);}
        res.redirect('/auth/login');
    })
});
 


//export default router;

AuthRouter.post('/signup', UserController.createUser)
AuthRouter.get('/profile/:userId', UserController.getUserProfile)

// AuthRouter.get('/logout',isLoggedIn, (req,res)=>{
//     req.logout();
//     req.session.destroy('/');
// });

AuthRouter.get('/google',passport.authenticate('google'));




export {AuthRouter};*/