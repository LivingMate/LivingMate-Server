
// import { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// //import config from '../config';
// //import { logger } from '../config/logger';
// import errorGenerator from '../../Error/errorGenerator';
// import message from '../modules/message';
// import statusCode from '../modules/statusCode';


// export default (req: Request, res: Response, next: NextFunction) => {
//   // request-header 에서 토큰 받아오기
//   const token = req.headers['authorization']?.split(' ').reverse()[0];

//   // 토큰 유뮤 검증
//   if (!token) {
//     throw errorGenerator({
//       msg: message.NULL_VALUE_TOKEN,
//       statusCode: statusCode.UNAUTHORIZED
//     });
//   }

//   // 토큰 검증
//   try {
//     const decoded = jwt.verify(token, jwtSecret);

//     req.body.user = (decoded as any).user;

//     next();
//   } catch (error){
//     throw new Error ('Authentication Error: middleware:auth')
//   }
// };
