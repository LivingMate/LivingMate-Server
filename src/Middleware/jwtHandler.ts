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
    expiresIn: '7d'
  });

  return accessToken;
};

const getRefreshToken = () => {
  const payload = {};

  const refreshToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "30d",
  });

  return refreshToken;
}

export { getToken, getRefreshToken };