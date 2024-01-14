"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const express_1 = __importDefault(require("express"));
const FeedRouter_1 = require("./Routers/FeedRouter");
const CalendarRouter_1 = require("./Routers/CalendarRouter");
const BudgetRouter_1 = require("./Routers/BudgetRouter");
const AuthRouter_1 = require("./Routers/AuthRouter");
const GroupRouter_1 = require("./Routers/GroupRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000); //  서버 포트
app.set('host', process.env.HOST || '0.0.0.0'); // 서버 아이피
app.get('/', (req, res) => {
    res.send('Typescript + Node.js + Express Server');
});
app.use(FeedRouter_1.FeedRouter);
app.use(CalendarRouter_1.CalendarRouter);
app.use(BudgetRouter_1.BudgetRouter);
app.use(AuthRouter_1.AuthRouter);
app.use(GroupRouter_1.GroupRouter);
app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중');
});
// const admin = require("firebase-admin");
// const serviceAccount = require("../serviceAcountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// app.use(function (err: ErrorType, req: Request, res: Response, next: NextFunction) {
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'production' ? err : {}
//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })
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
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.*/
//# sourceMappingURL=index.js.map