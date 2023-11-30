import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto';


// const createGroup

// const joinGroup

// const leaveGroup

// const createGroupCode







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
    const groupMembers = await prisma.user.findMany({ 
        where:{groupId:groupId},
        select:{
            userName:true,
            //userColor:true 
        }

    })
    //(이하 3줄: 각 property를 받아서 객체로 반환하는 방법 -> DTO 타입 맞추기 실패)
    // const memberNames = groupMembers.map(member => member.userName); 
    // const memberColors = groupMembers.map(member => member.userColor);
    // return {memberNames, memberColors};

    //(이하 4줄: 비슷함. 얘도 DTO 타입 맞추기 실패)
    // return groupMembers.map(member => ({
    //     userName: member.userName,
    //     userColor: member.userColor
    // }));

    return groupMembers.map(member => member.userName); //이름만 묶어서 array로 반환하는 버전 
}

//return groupMembers 하면 나오는 모양: 
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


const findGroupMembersColorsByGroupId = async(groupId:string) =>{
    const groupMembers = await prisma.user.findMany({ 
        where:{groupId:groupId},
        select:{
            userColor:true, 
        }
    })
    return groupMembers.map(member => member.userColor); //컬러만 묶어서 array로 반환하는 버전 
}

//멤버 이름과 컬러를 따로 받는 방법의 문제점: 순서가 그대로일지.. 모름... 색이 서로 바뀔 수도 있음. 









export default{
    findGroupNameByGroupId,
    findGroupMembersNamesByGroupId,
    findGroupMembersColorsByGroupId
}