import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;
// import express, { NextFunction, Request, Response } from 'express';
// import { Router } from 'express';
// import routes from "./Routers";
// import { createUser } from './Services/UserService';
// import message from './modules/message';

// const router = Router();
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// app.use(routes);
// app.use(function(req:Request, res:Response, next:NextFunction){
//    res.status(404);
// })

// app.get("/", function(req, res){
//    console.log("hi");
//    res.render("test1", {});
// })

// app.listen(3000, () => {
//   console.log('서버가 3000번 포트에서 실행 중')
// })


// interface ErrorType {
//    message: string;
//    status: number;
// }
 
// app.use(function(
//    err: ErrorType,
//    req: Request,
//    res: Response,
//    next: NextFunction
//   ) {
//    res.locals.message = err.message;
//    res.locals.error = req.app.get('env') === 'production' ? err : {};
 
//    // render the error page
//    res.status(err.status || 500);
//    res.render('error');
//  });

/*
...
const passport = require('passport');

...
const passportConfig = require('./passport');

...
const authRouter = require('./routes/auth'); // 인증 라우터

const app = express();
passportConfig(); // 패스포트 설정

...
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
         httpOnly: true,
         secure: false,
      },
   }),
);
//! express-session에 의존하므로 뒤에 위치해야 함
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.



...
 */






// ---------------------
import express, { Express, Request, Response } from "express";
import {FeedRouter} from './Routers/FeedRouter';
import { CalendarRouter } from './Routers/CalendarRouter';
const app = express();

app.set("port", process.env.PORT || 3000); //  서버 포트
app.set("host", process.env.HOST || "0.0.0.0"); // 서버 아이피

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript + Node.js + Express Server");
});
 
app.get('/feeds', async (req, res) => {
   try {
     const items = await prisma.feed.findMany();
     res.json(items);
   } catch (error) {
     res.status(500).json({ error: 'Error fetching items' });
   }
 });

 app.get('/user', async (req, res) => {
   try {
     const items = await prisma.user.findMany();
     res.json(items);
   } catch (error) {
     res.status(500).json({ error: 'Error fetching items' });
   }
 });

app.use(FeedRouter);
app.use(CalendarRouter);

app.listen(3000, () => {
   console.log('서버가 3000번 포트에서 실행 중') })
