import { PrismaClient } from '@prisma/client'
import { BudgetBaseDto } from '../DTOs/Budget/BudgetBaseDto'
import { BudgetCreateRequestDto } from '../DTOs/Budget/Request/BudgetCreateRequestDto'
import { BudgetUpdateRequestDto } from '../DTOs/Budget/Request/BudgetUpdateRequestDto'
const prisma = new PrismaClient()

//지출내역 등록
const createBudget = async (BudgetBaseDto: BudgetBaseDto, groupId:string) => {
  const newBudget = await prisma.userSpendings.create({
    data: {
      userId: BudgetBaseDto.userid,
      groupId: groupId,
      spendingName: BudgetBaseDto.name,
      spendings: BudgetBaseDto.spending,
      categoryId: BudgetBaseDto.category,
      subCategoryId: BudgetBaseDto.subCategory,
    },
  })
  return newBudget;
}

//지출내역 보여주기
const showBudget = async (groupId: string) => {
  const Budgets = await prisma.userSpendings.findMany({
    take: 10,
    where: {
      groupId: groupId,
    },
  })
  return Budgets
}


//지출내역 수정
const updateBudgetContent = async (budgetId: number, BudgetUpdateRequestDto: BudgetUpdateRequestDto) => {
  try {
    const updatedBudget = await prisma.userSpendings.update({
      where: {
        id: budgetId,
      },
      data: {
        spendings: BudgetUpdateRequestDto.spending,
        categoryId: BudgetUpdateRequestDto.category,
        subCategoryId: BudgetUpdateRequestDto.subCategory,
      },
    })
  } catch (error) {
    throw new Error('Error updating Budget Contents')
  }
}

//지출내역 삭제
const deleteBudget = async (BudgetId: number) => {
  const deletedBudget = await prisma.userSpendings.delete({
    where: {
      id: BudgetId,
    },
  })
  return 0
}
//showBudget에 따라서 + 이런저런 사정에 따라서 파라미터로 받는게 GroupId가 될 수도 있고 DTO가 될 수도 있구나..
// 그러면 수정 해줘야해...

//지출내역 검색
const searchBudget = async (groupId: string, searchKey: string) => {
  const searchedBudget = await prisma.userSpendings.findMany({
    where: {
      groupId: groupId,
      spendingName: {
        contains: searchKey,
      },
    },
  })

  const results = searchedBudget.map((budget) => {
    return {
      id: budget.id,
      name: budget.spendingName,
      spending: budget.spendings,
      createdAt: budget.createdAt,
      userId: budget.userId,
      category: budget.categoryId,
      subcategory: budget.subCategoryId
    }
  })

  return results
}

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

    let groupMemberSpendings: { userId: string; userSpending: number }[] = []
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


const getUserSpending = async (groupId: string): Promise<{ userId: string; userSpending: number }[]> => {
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

  const groupMemberSpendingsBefore: { userId: string; userSpending: number }[] = []

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
const getAdjustments = async (groupId: string)=> {
  const GroupMemberSpendingsAfter = await getGroupMemberSpending(groupId);
  //{userId,userSpending-AvgGroupSpending}[] 모양

  if(!GroupMemberSpendingsAfter){
    throw new Error("No Spendings found: getAdjustmets")
  }

  let Positives = GroupMemberSpendingsAfter.filter(obj => obj.userSpending>=0);
  let Negatives = GroupMemberSpendingsAfter.filter(obj => obj.userSpending<0);

  Positives.sort((a,b)=>b.userSpending - a.userSpending);
  Negatives.sort((a,b)=>b.userSpending - a.userSpending); //내림차순 정렬 완료

  while(Positives[0].userSpending != null && Negatives[0].userSpending != null){

  }



}


const sendToAdjustments = async(groupId: string, Distiction: number, positivesId:string, negativesId:string, change:number)=>{

}//근데 여기서 2번 이상 레코드로 적힌 애들 중에 뭐가 진짜 마지막 계산 결과인지를 알아내지?
// Distinction으로 묶어내고.. 




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

  return lastday
}



// 서브카테고리 추가+삭제
const updateSubCategory = async(budgetId: number, subCategoryId:number)=>{
  if(!subCategoryId){
    throw new Error('no such category found: updateSubCategory')
  }

  const newBudget = await prisma.userSpendings.update({
    where:{
      id : budgetId,
    },
    data:{
      subCategoryId: subCategoryId,
    }
  })

  return newBudget;
}


// 서브카테고리 새로 만들기
const updateNewSubCategory = async(groupId:number, name:string)=>{
  const newSubCategory = await prisma.subCategory.create({
    data:{
      name: name,
    }
  })
  return newSubCategory;
}



export default {
  searchBudget,
  createBudget,
  showBudget,
  updateBudgetContent,
  deleteBudget,
  getGroupMemberSpending,
  getDayReturn,
  updateSubCategory,
  updateNewSubCategory
}
