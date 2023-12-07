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

    //Positives = Positives.filter(obj => obj.userSpending != null);
    //Negatives = Negatives.filter(obj => obj.userSpending != null);

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
//근데 여기서 2번 이상 레코드로 적힌 애들 중에 뭐가 진짜 마지막 계산 결과인지를 알아내지? => 두 번 이상 안 적히나?
// Distinction으로 묶어내고.. 그런데 distinction으로 묶을 기준을 알기 어려움. 무슨 말이냐면.. 어디부터 어디까지가 distinction id 1로 쳐 질건데?
// 아니면 한 그룹에서 정산을 이어서 여러번 하지 않을 확률이 높다는 걸 가지고 같은 날짜에 이루어진 transaction만 뽑아내는 방법도 있음
// 이거 괜찮을 것 같아. 그리고 "정산은 하루에 1회만 가능합니다." 라고 못박아두자 

//정산 완료를 누르면 adjustment 지워버리기...

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





export default {
  searchBudget,
  createBudget,
  showBudget,
  updateBudgetContent,
  deleteBudget,
  getGroupMemberSpending,
  getDayReturn,
  updateSubCategory,
  updateNewSubCategory,
  takeFromAdjustments,
  sendToAdjustments,
  getAdjustmentsCalc,
  getAdjustments
}
