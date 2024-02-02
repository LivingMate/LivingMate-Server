import jwt from 'jsonwebtoken';
import config from '../config';
import { JwtPayloadInfo } from "../DTOs/Auth/JwtPayloadInfo";

const getToken = (userId: string): string => {
  const payload: JwtPayloadInfo = {
    user: {
      id: userId
    }
  };

  const accessToken: string = jwt.sign(payload, config.jwtSecret, {
    expiresIn: '30d'
  });

  return accessToken;
};

export { getToken };