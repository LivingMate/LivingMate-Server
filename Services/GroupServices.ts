import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;

const findGroupNameByGroupId = async(groupId:string)=>{
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

const findGroupMembersNamesByGroupId = async(groupId:string) =>{
    const groupMember = await prisma.user.findMany({ 
        where:{groupId:groupId},
        select:{
            userName:true,
            //userColor:true 
        }

    })
    return groupMember;
}

//Returns would be in array of: 
// [
//     {
//         userName: 'User 1',
//         userColor: 'Color 1'
//     },
//     {
//         userName: 'User 2',
//         userColor: 'Color 2'
//     },
//     // ...other user objects
// ]





export{
    findGroupNameByGroupId,
    findGroupMembersNamesByGroupId
}