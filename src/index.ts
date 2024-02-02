import express, { Express, Request, Response, NextFunction } from 'express'
import { FeedRouter } from './Routers/FeedRouter'
import { CalendarRouter } from './Routers/CalendarRouter';
import { BudgetRouter } from './Routers/BudgetRouter';
import { AuthRouter } from './Routers/AuthRouter';
import { GroupRouter } from './Routers/GroupRouter';
import { UserRouter } from './Routers/UserRouter';
import { NotiRouter } from './Routers/NotificationRouter'
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000) //  서버 포트
app.set('host', process.env.HOST || '0.0.0.0') // 서버 아이피

app.get('/', (req: Request, res: Response) => {
  res.send('Typescript + Node.js + Express Server')
})


app.use(FeedRouter);
app.use(CalendarRouter);
app.use(BudgetRouter);
app.use(AuthRouter);
app.use(GroupRouter);
app.use(UserRouter);
app.use(NotiRouter);

app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중')
})


// // 토큰 관련
// const admin = require("firebase-admin");
// const serviceAccount = require("../serviceAcountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });








app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET!,
      cookie: {
         httpOnly: true,
         secure: false,
      },
   }),
);

