import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
 
  /**
   * jwt Secret
   */
  jwtSecret: process.env.JWT_SECRET as string,

};