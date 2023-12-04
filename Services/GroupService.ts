import { Group, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto'
import { GroupResponseDto } from '../DTOs/Group/Responses/GroupResponseDto'
import { group } from 'console'

// userId로 user 찾기
const findUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (!user) {
    throw new Error('No user found with the given userId')
  }
  return user
}

// groupId로 group찾기
const findGroupById = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  })
  if (!group) {
    throw new Error('No group found with the given groupId')
  }
  return group
}

// 유효한 그룹인지 확인
const checkForbiddenGroup = async (userGroupId: string, GroupId: string) => {
  try {
    const userGroup = await prisma.group.findUnique({
      where: {
        id: userGroupId,
      },
    })

    if (!userGroup || userGroup.id !== GroupId) {
      throw new Error('Forbidden Room')
    }
  } catch (error) {
    throw error
  }
}

// join된 그룹인지 확인하기
const checkJoinedGroupId = async (groupId: string) => {
  try {
    const existingGroup = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    })

    if (!existingGroup) {
      throw new Error('Joined Group')
    }
  } catch (error) {
    throw error
  }
}

// createGroup
const createGroup = async (userId: string): Promise<GroupResponseDto> => {
  try {
    const user = await findUserById(userId)

    await checkJoinedGroupId(user?.groupId || '')

    const createdGroup = await prisma.group.create({
      data: {
        groupOwner: userId,
        groupCode: user.groupId || '',
        groupName: '',
        groupSpending: 0,
      },
    })

    const data: GroupResponseDto = {
      _id: createdGroup.id,
      groupCode: createdGroup.groupCode,
    }
    return data
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 그룹 나가기
const leaveGroup = async (userId: string, groupId: string): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    })

    if (!group) {
      throw new Error('Group not found')
    }

    // user가 나가는지 groupOwner가 나가는지
    if (group.groupOwner === userId) {
      // groupOwner가 나가면 group 걍 사라짐
      await prisma.group.delete({
        where: {
          id: groupId,
        },
      })
    } else {
      // 일반 user가 나가면 그룹 탈퇴로 적용
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          groupId: null,
        },
      })
    }
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

const findGroupNameByGroupId = async (groupId: string) => {
  const groupName = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      groupName: true,
    },
  })
  if (!groupName) {
    throw new Error('groupName not found!')
  }

  return groupName
}


const findGroupMembersNamesByGroupId = async (groupId: string) => {
  const groupMembers = await prisma.user.findMany({
    where: { groupId: groupId },
    select: {
      userName: true,
      //userColor:true
    },
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

  return groupMembers.map((member) => member.userName) //이름만 묶어서 array로 반환하는 버전
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


const findGroupMembersColorsByGroupId = async (groupId: string) => {
  const groupMembers = await prisma.user.findMany({
    where: { groupId: groupId },
    select: {
      userColor: true,
    },
  })
  return groupMembers.map((member) => member.userColor) //컬러만 묶어서 array로 반환하는 버전
}

//멤버 이름과 컬러를 따로 받는 방법의 문제점: 순서가 그대로일지.. 모름... 색이 서로 바뀔 수도 있음.


// 그룹 받기
const getGroup = async (userId: string): Promise<string | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      return user.groupId ?? null;
    } catch (error) {
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  };


export default {
  findUserById,
  findGroupById,
  checkForbiddenGroup,
  checkJoinedGroupId,
  createGroup,
  leaveGroup,
  findGroupNameByGroupId,
  findGroupMembersNamesByGroupId,
  findGroupMembersColorsByGroupId,
  getGroup,
}
