import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;

const findGroupNameByGroupId = async(groupId:string):Promise<string|null>=>{
    const groupName = await prisma.group.findUnique({
        where:{
            id:groupId
        }, 
        select:{
            groupName: true
        }
        
    });
    if(!groupName){
        throw new Error('groupName not found!')
    }

    return groupName;
}

export{
    findGroupNameByGroupId
}