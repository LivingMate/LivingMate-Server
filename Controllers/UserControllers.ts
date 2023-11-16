import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const findUserById = async(userId:string)=>{
    const user = await prisma.user.findUnique({
        where: {
            userId: userId, //오류 아직 안 잡음
        }
    });
    if(!user){
        throw new Error('User not found');
    }

    return user;
};