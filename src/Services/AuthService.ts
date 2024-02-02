import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import errorGenerator from '../../error/errorGenerator';
import message from '../modules/message';
import statusCode from '../modules/statusCode';
import { LoginDto } from "../DTOs/Auth/Requests/LoginDto";
const prisma = new PrismaClient()


const login = async (loginDto: LoginDto) => {
  try {
    
    const user = await prisma.user.findUnique({
      where: {
        email: loginDto.email
      }
    })

    if (!user)
      throw errorGenerator({
        msg: message.NOT_FOUND_USER_EMAIL,
        statusCode: statusCode.NOT_FOUND
      });

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch)
      throw errorGenerator({
        msg: message.INVALID_PASSWORD,
        statusCode: statusCode.UNAUTHORIZED
      });


    const data = {
      userId: user.id
    };

    return data;
  } catch (error) {
    throw error;
  }
};

export { login }
 




