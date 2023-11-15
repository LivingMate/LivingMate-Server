import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const findUserById = async(userId:string)=>{
    const user = await prisma.user.findUnique({
        where: {
            userId: userId,
        }
    });
    if(!user){
        throw new Error('User not found');
    }

    return user;
};