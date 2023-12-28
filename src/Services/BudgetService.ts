import { Category, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { BudgetCreateRequestDto } from '../DTOs/Budget/Request/BudgetCreateRequestDto'
import { BudgetCreateResponseDto } from '../DTOs/Budget/Response/BudgetCreateResponseDto'
import { BudgetUpdateRequestDto } from '../DTOs/Budget/Request/BudgetUpdateRequestDto'
import { checkForbiddenGroup } from './GroupService'
import {getUserNameByUserId} from './UserService'
import message from '../modules/message'

// ------------utils-------------
// 유저 찾기
const findUserById = async (userId: string) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!data) {
    throw new Error(message.UNAUTHORIZED);
  }
  return data;
};


// 그룹 찾기
const findGroupById = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  })

  if (!group) {
    throw new Error(message.UNAUTHORIZED)
  }
  return group
}


// 카테고리 이름으로 아이디 찾기
const findCategIdByName = async (categoryName: string) => {
  // userId가 정의되어 있지 않거나 문자열이 아닌 경우 에러 발생
  if (!categoryName || typeof categoryName !== 'string') {
    throw new Error('Invalid categoryName');
  }

  const data = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });
  if (!data) {
    throw new Error(message.UNAUTHORIZED);
  }
  return data.id
};

// 섭카테고리 이름으로 섭카테고리 id 찾기
async function findSubCategIdByName(subCategoryName: string) {
  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: {
        name: subCategoryName,
      },
    })

    if (subCategory) {
      return subCategory.id
    } else {
      return -1
    }
  } catch (error) {
    console.error('Error in findSubCategIdByName:', error)
    throw error
  }
}

// userId로 userColor 찾기
const findUserColorByUserId = async (userId: string) => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (data) {
      return data.userColor
    } else {
      return 'error'
    }
  } catch (error) {
    console.error('error :: service/budget/findUserColorByUserId', error)
    throw error
  }
}

// id를 name으로 반환
async function changeCategIdToName(categoryId: number) {
  try {
    const result = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (result) {
      return result.name
    } else {
      return 'error'
    }
  } catch (error) {
    console.error('Error in changeCategIdByName:', error)
    throw error
  }
}

// subId를 name으로 반환
async function changeSubCategIdToName(subCategoryId: number) {
  try {
    const result = await prisma.subCategory.findUnique({
      where: {
        id: subCategoryId,
      },
    })

    if (result) {
      return result.name
    } else {
      return 'error'
    }
  } catch (error) {
    console.error('Error in changeSubCategIdByName:', error)
    throw error
  }
}

// -------------real service----------------
// 지출 등록
const createBudget = async (
  userId: string,
  groupId: string,
  budgetCreateRequestDto: BudgetCreateRequestDto,
): Promise<BudgetCreateResponseDto> => {
    try {
    const user = await findUserById(userId)
    const group = await findGroupById(groupId)
    const reqCategoryId = await findCategIdByName(budgetCreateRequestDto.category)
    const reqSubCategoryId = await findSubCategIdByName(budgetCreateRequestDto.subCategory)
    await checkForbiddenGroup(user.groupId, groupId)

    const event = await prisma.userSpendings.create({
      data: {
        userId: userId,
        groupId: groupId,
        spendingName: budgetCreateRequestDto.spendingName,
        spendings: budgetCreateRequestDto.spendings,
        categoryId: reqCategoryId,
        subCategoryId: reqSubCategoryId,
      },
    })

    // categoryId와 subCategoryId 변환
    const resCategory = await changeCategIdToName(event.categoryId);
    const resSubCategory = await changeSubCategIdToName(event.subCategoryId);
    const resUserColor = await findUserColorByUserId(event.userId);
    const resUserName = await getUserNameByUserId(event.userId);

    const createdBudget: BudgetCreateResponseDto = {
      id: event.id,
      spendingName: event.spendingName,
      spendings: event.spendings,
      category: resCategory,
      subCategory: resSubCategory,
      userColor: resUserColor,
      userName: resUserName,
      createdAt: event.createdAt,
    }

    return createdBudget;

  } catch (error) {
    console.error('error :: service/budget/createBudget', error);
    throw error;
  }
};





//지출내역 보여주기
const showBudget = async (groupId: string) => {
  try{
    const Budgets = await prisma.userSpendings.findMany({
      take: 10,
      where: {
        groupId: groupId,
      },
    })
    return Budgets;

    // let BudgetsToShow: BudgetCreateResponseDto[] = [];
    // BudgetsToShow =  Budgets.map((budget)=>{

    //   let resCategory = await changeCategIdToName(budget.categoryId);
    //   let resSubCategory = await changeSubCategIdToName(budget.subCategoryId);
    //   let resUserColor = await findUserColorByUserId(budget.userId);
    //   let resUserName = await getUserNameByUserId(budget.userId);
  
    //   spendingName: budget.spendingName,
    //   spendings: budget.spendings,
    //   category: resCategory,
    //   subCategory: resSubCategory,
    //   userColor: resUserColor,
    //   userName: resUserName,
    //   createdAt: budget.createdAt,
    // })

  } catch(error) {
    console.error('error :: service/budget/showBudget', error)
    throw error;
  }
}



//지출내역 수정
const updateBudget = async (budgetId: number, BudgetUpdateRequestDto: BudgetUpdateRequestDto) => {
  try {
    const updatedBudget = await prisma.userSpendings.update({
      where: {
        id: budgetId,
      },
      data: {
        spendingName : BudgetUpdateRequestDto.spendingName,
        spendings: BudgetUpdateRequestDto.spending,
        categoryId: BudgetUpdateRequestDto.category,
        subCategoryId: BudgetUpdateRequestDto.subCategory,
      },
    })
    //return updatedBudget;
    const UserName = await getUserNameByUserId(updatedBudget.userId);
    const UserColor = await findUserColorByUserId(updatedBudget.userId);
    const resCategory = await changeCategIdToName(updatedBudget.categoryId);
    const resSubCategory = await changeSubCategIdToName(updatedBudget.subCategoryId);

    const budgetToReturn : BudgetCreateResponseDto={
    userColor: UserColor,
    userName: UserName,
    createdAt: updatedBudget.createdAt,
    spendings: updatedBudget.spendings,
    spendingName: updatedBudget.spendingName,
    id: updatedBudget.id,
    category: resCategory,
    subCategory: resSubCategory
  };
  return budgetToReturn;

  } catch (error) {
    throw new Error('error :: service/budget/updateBudgetContent')
  }
}

//지출내역 삭제
const deleteBudget = async (BudgetId: number) => {
  try{
    await prisma.userSpendings.delete({
      where: {
        id: BudgetId,
      },
    })
    return 0;
  } catch (error) {
    throw new Error('error :: service/budget/deleteBudget')
  }
}


//지출내역 검색
const searchBudget = async (groupId: string, searchKey: string) => {
  try{
    const searchedBudget = await prisma.userSpendings.findMany({
      where: {
        groupId: groupId,
        spendingName: {
          contains: searchKey,
        },
      },
    })

    return searchedBudget;

    // const results = searchedBudget.map((budget) => {
    //   let userName = getUserNameByUserId(budget.userId);

    //   return {
    //     name: userName,
    //     spending: budget.spendings,
    //     createdAt: budget.createdAt,
    //     userId: budget.userId,
    //     category: budget.categoryId,
    //     subcategory: budget.subCategoryId
    //   }
    // })
    // return results;

  } catch (error) {
  throw new Error('error :: service/budget/searchBudget');
  }
}


// 서브카테고리 수정
const updateSubCategory = async(budgetId: number, subCategory:string)=>{
  if(!subCategory){
    throw new Error('no such category found: updateSubCategory');
  }
  const subCategoryId = await findSubCategIdByName(subCategory);
  const newBudget = await prisma.userSpendings.update({
    where:{
      id : budgetId,
    },
    data:{
      subCategoryId: subCategoryId,
    }
  });

  //return newBudget;
  const UserName = await getUserNameByUserId(newBudget.userId);
  const UserColor = await findUserColorByUserId(newBudget.userId);
  const resCategory = await changeCategIdToName(newBudget.categoryId);
  const resSubCategory = await changeSubCategIdToName(newBudget.subCategoryId);
  const budgetToReturn : BudgetCreateResponseDto={
    userColor: UserColor,
    userName: UserName,
    createdAt: newBudget.createdAt,
    spendings: newBudget.spendings,
    spendingName: newBudget.spendingName,
    id: newBudget.id,
    category: resCategory,
    subCategory: resSubCategory
  };
  return budgetToReturn;
}


/*
// 서브카테고리 새로 만들기
const createSubCategory = async(groupId:number, name:string)=>{
  const newSubCategory = await prisma.subCategory.create({
    data:{
      name: name,
    }
  })
  return newSubCategory;
}
*/



//정산 파트1: 지출 합산 내역 반환
const getGroupMemberSpending = async (groupId: string) => {
  const GroupSpending = await prisma.userSpendings.groupBy({
    by: ['groupId'],
    _sum: {
      spendings: true,
    },
    _avg: {
      spendings: true,
    },
    where: {
      isDone: false,
    },
  }) //그룹 썸 구하기

  for (const group of GroupSpending) {
    const groupId = group.groupId
    const groupSum = group._sum.spendings
    const groupAvg = group._avg.spendings

    let groupMemberSpendings: { userId: string; userSpending: number}[] = []
    groupMemberSpendings = await getUserSpending(groupId)

    groupMemberSpendings.forEach((member) => {
      if (member.userSpending == null || groupAvg == null) {
        throw new Error('Null Error: getGroupSpending')
      }
      member.userSpending -= groupAvg
    })
    return groupMemberSpendings    //각 지출액 - 그룹 평균 지출액 값 반환함
  }
}


const getUserSpending = async (groupId: string): Promise<{ userId: string; userSpending: number}[]> => {
  const userSpendings = await prisma.userSpendings.groupBy({
    by: ['userId'],
    _sum: {
      spendings: true,
    },
    where: {
      groupId: groupId,
      isDone: false,
    },
  })

  const groupMemberSpendingsBefore: { userId: string; userSpending: number}[] = []

  userSpendings.forEach((record) => {
    const userId = record.userId
    const userSpending = record._sum.spendings

    if (userSpending == null) {
      throw new Error('Null error: groupMemberSpendings')
    }

    groupMemberSpendingsBefore.push({ userId, userSpending })
  })

  return groupMemberSpendingsBefore;
}


//정산 파트2 : 누가 누구한테 얼마나 주면 될까요?
const getAdjustmentsCalc = async (groupId: string)=> {
  const GroupMemberSpendingsAfter = await getGroupMemberSpending(groupId);
  //{userId,userSpending-AvgGroupSpending}[] 모양

  if(!GroupMemberSpendingsAfter){
    throw new Error("No Spendings found: getAdjustments")
  }

  if(GroupMemberSpendingsAfter.some(obj => obj.userSpending === null)){
    throw new Error('Null Value error')
  }

  let Positives = GroupMemberSpendingsAfter.filter(obj => obj.userSpending >= 0);
  let Negatives = GroupMemberSpendingsAfter.filter(obj => obj.userSpending < 0);

  Positives = Positives.sort((a,b)=>b.userSpending - a.userSpending);
  Negatives = Negatives.sort((a,b)=>b.userSpending - a.userSpending); //내림차순 정렬 완료

  while(!isNaN(Positives[0].userSpending) && !isNaN(Negatives[0].userSpending)){


    if(Positives[0].userSpending > Negatives[0].userSpending){
      sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Negatives[0].userSpending);
      Positives[0].userSpending += Negatives[0].userSpending;
      Negatives[0].userSpending = NaN; 
    }

    else if(Positives[0].userSpending < Negatives[0].userSpending){
      sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
      Negatives[0].userSpending += Positives[0].userSpending;
      Positives[0].userSpending = NaN;
    }

    else{
      sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
      Negatives[0].userSpending = NaN;
      Positives[0].userSpending = NaN;
    }

    Positives = Positives.sort((a,b)=>b.userSpending - a.userSpending);
    Negatives = Negatives.sort((a,b)=>b.userSpending - a.userSpending); 
  }
  return 0;
}


const sendToAdjustments = async(groupId: string, fromId:string, toId:string, change:number)=>{
  const Adjustment = await prisma.adjustment.create({
    data:{
      groupId: groupId,
      plusUserId: toId,
      minusUserId: fromId,
      change: change
    }
  })

}

const takeFromAdjustments = async(groupId: string)=>{
  const Adjustment = await prisma.adjustment.findMany({
    select:{
      plusUserId: true,
      minusUserId: true,
      change: true
    },
    where:{
      groupId: groupId,
    }
  })
  return Adjustment;
}
//userId 별로 보여줘야 함
// show Category

//adjustment 지우기 -> 정산 완료 눌렀을 때 사용할 것.. 
const deleteAdjustment = async(groupId: string)=>{
  const AdjustmentDeletion = await prisma.adjustment.deleteMany({
    where:{
      groupId: groupId
    }
  })
  return 0;
}

//정산 마이너 기능 (날짜 반환)
const getDayReturn = async (groupId: string) => {
  const lastday = await prisma.userSpendings.findFirst({
    where: {
      groupId: groupId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  if (!lastday) {
    throw new Error('Error in retrieving date: dayreturn')
  }

  return lastday;
}

const getAdjustments = async(groupId: string)=>{
  const AdjustedResult = await takeFromAdjustments(groupId);
  const LastCalculatedDate = await getDayReturn(groupId);

  return {LastCalculatedDate, AdjustedResult};
}





export {
  findUserById,
  findGroupById,
  findCategIdByName,
  findSubCategIdByName,
  findUserColorByUserId,
  changeCategIdToName,
  changeSubCategIdToName,
  createBudget,
  showBudget,
  updateBudget,
  deleteBudget,
  getGroupMemberSpending,
  getDayReturn,
  //updateSubCategory,
  //updateNewSubCategory,
  takeFromAdjustments,
  sendToAdjustments,
  getAdjustmentsCalc,
  getAdjustments,
  searchBudget
}
