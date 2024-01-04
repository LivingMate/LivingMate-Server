import { Category, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { BudgetCreateRequestDto } from '../../DTOs/Budget/Request/BudgetCreateRequestDto'
import { BudgetCreateResponseDto } from '../../DTOs/Budget/Response/BudgetCreateResponseDto'
import { BudgetUpdateRequestDto } from '../../DTOs/Budget/Request/BudgetUpdateRequestDto'
import { checkForbiddenGroup } from '../GroupService'
import message from '../../modules/message'
import * as UserService from '../UserService'
import * as GroupService from '../GroupService'
import * as BudgetServiceUtils from '../Budget/BudgetServiceUtils'

// -------------real service----------------
// 지출 등록
const createBudget = async (
  userId: string,
  groupId: string,
  budgetCreateRequestDto: BudgetCreateRequestDto,
): Promise<BudgetCreateResponseDto> => {
  try {
    const user = await UserService.findUserById(userId)
    const group = await GroupService.findGroupById(groupId)
    const reqCategoryId = await BudgetServiceUtils.findCategIdByName(budgetCreateRequestDto.category)
    const reqSubCategoryId = await BudgetServiceUtils.findSubCategIdByName(budgetCreateRequestDto.subCategory)
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
    const resCategory = await BudgetServiceUtils.changeCategIdToName(event.categoryId)
    const resSubCategory = await BudgetServiceUtils.changeSubCategIdToName(event.subCategoryId)
    const resUserColor = await UserService.findUserColorByUserId(event.userId)
    const resUserName = await UserService.getUserNameByUserId(event.userId)

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

    return createdBudget
  } catch (error) {
    console.error('error :: service/budget/createBudget', error)
    throw error
  }
}

//지출내역 보여주기
const showBudget = async (groupId: string) => {
  try {
    const Budgets = await prisma.userSpendings.findMany({
      take: 10,
      where: {
        groupId: groupId,
      },
    })

    let BudgetsToShow: BudgetCreateResponseDto[] = []

    await Promise.all(
      Budgets.map(async (budget) => {
        let resCategory = await BudgetServiceUtils.changeCategIdToName(budget.categoryId)
        let resSubCategory = await BudgetServiceUtils.changeSubCategIdToName(budget.subCategoryId)
        let resUserColor = await UserService.findUserColorByUserId(budget.userId)
        let resUserName = await UserService.getUserNameByUserId(budget.userId)

        BudgetsToShow.push({
          id: budget.id,
          spendingName: budget.spendingName,
          spendings: budget.spendings,
          category: resCategory,
          subCategory: resSubCategory,
          userColor: resUserColor,
          userName: resUserName,
          createdAt: budget.createdAt,
        })
      }),
    )

    return BudgetsToShow
  } catch (error) {
    console.error('error :: service/budget/showBudget', error)
    throw error
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
        spendingName: BudgetUpdateRequestDto.spendingName,
        spendings: BudgetUpdateRequestDto.spending,
        categoryId: await BudgetServiceUtils.findCategIdByName(BudgetUpdateRequestDto.category),
        subCategoryId: await BudgetServiceUtils.findSubCategIdByName(BudgetUpdateRequestDto.subCategory),
      },
    })
    //return updatedBudget;

    const UserName = await UserService.getUserNameByUserId(updatedBudget.userId)
    const UserColor = await UserService.findUserColorByUserId(updatedBudget.userId)
    const resCategory = await BudgetServiceUtils.changeCategIdToName(updatedBudget.categoryId)
    const resSubCategory = await BudgetServiceUtils.changeSubCategIdToName(updatedBudget.subCategoryId)

    const budgetToReturn: BudgetCreateResponseDto = {
      userColor: UserColor,
      userName: UserName,
      createdAt: updatedBudget.createdAt,
      spendings: updatedBudget.spendings,
      spendingName: updatedBudget.spendingName,
      id: updatedBudget.id,
      category: resCategory,
      subCategory: resSubCategory,
    }
    return budgetToReturn
  } catch (error) {
    throw new Error('error :: service/budget/updateBudgetContent')
  }
}

//지출내역 삭제
const deleteBudget = async (BudgetId: number) => {
  try {
    await prisma.userSpendings.delete({
      where: {
        id: BudgetId,
      },
    })
    return 0
  } catch (error) {
    throw new Error('error :: service/budget/deleteBudget')
  }
}

//지출내역 검색
const searchBudget = async (groupId: string, searchKey: string) => {
  try {
    const searchedBudget = await prisma.userSpendings.findMany({
      where: {
        groupId: groupId,
        spendingName: {
          contains: searchKey,
        },
      },
    })

    let BudgetsToShow: BudgetCreateResponseDto[] = []

    await Promise.all(
      searchedBudget.map(async (budget) => {
        let resCategory = await BudgetServiceUtils.changeCategIdToName(budget.categoryId)
        let resSubCategory = await BudgetServiceUtils.changeSubCategIdToName(budget.subCategoryId)
        let resUserColor = await UserService.findUserColorByUserId(budget.userId)
        let resUserName = await UserService.getUserNameByUserId(budget.userId)

        BudgetsToShow.push({
          id: budget.id,
          spendingName: budget.spendingName,
          spendings: budget.spendings,
          category: resCategory,
          subCategory: resSubCategory,
          userColor: resUserColor,
          userName: resUserName,
          createdAt: budget.createdAt,
        })
      }),
    )

    return BudgetsToShow
  } catch (error) {
    throw new Error('error :: service/budget/searchBudget')
  }
}

// 서브카테고리 새로 만들기 // categoryName-<id
const createSubCategory = async (groupId: string, categoryId: number, name: string) => {
  const newSubCategory = await prisma.subCategory.create({
    data: {
      name: name,
      groupId: groupId,
      categoryId: categoryId,
    },
  })
  return newSubCategory
}

//카테고리 보여주기 -> 만들 필요 있나??

//서브카테고리 보여주기
const showSubCategory = async (groupId: string, categoryName: string) => {
  const categoryId = await BudgetServiceUtils.findCategIdByName(categoryName)
  const SubCategories = await prisma.subCategory.findMany({
    select: {
      name: true,
    },
    where: {
      groupId: groupId,
      categoryId: categoryId,
    },
  })

  return SubCategories
}

//정산파트1 최종함수//
//각 지출액 - 그룹 평균 지출액 값 반환
const getGroupMemberSpending = async (groupId: string) => {
  const GroupSpending = await prisma.userSpendings.groupBy({
    by: ['groupId'],
    where: {
      groupId: groupId,
      isDone: false,
    },
    _sum: {
      spendings: true,
    },
    // having:{
    //   groupId: groupId
    // }
  })

  for (const group of GroupSpending) {
    const groupId = group.groupId
    const groupSum = group._sum.spendings
    if (!groupSum) {
      throw new Error('groupSum Error: Null')
    }
    const memberNum = await getMemberNumber(groupId)
    if (!memberNum) {
      throw new Error('memberNum Error: Null')
    }
    const groupAvg = Math.round(groupSum / memberNum)

    let groupMemberSpendings: { userId: string; userSpending: number }[] = []
    groupMemberSpendings = await getUserSpending(groupId)

    groupMemberSpendings.forEach((member) => {
      if (member.userSpending == null || groupAvg == null) {
        throw new Error('Null Error: getGroupMemberSpending')
      }
      member.userSpending -= groupAvg
    })
    //console.log('각 지출액 - 그룹 평균 지출액:', groupMemberSpendings)
    return groupMemberSpendings
  }
}

const getMemberNumber = async (groupId: string) => {
  const memberNum = await prisma.user.groupBy({
    by: ['groupId'],
    where: {
      groupId: groupId,
    },
    _count: {
      _all: true,
    },
  })

  let memberNumInt
  memberNum.forEach((member) => {
    memberNumInt = member._count._all
  })

  return memberNumInt
}

//각 유저의 지출액 합
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

  return groupMemberSpendingsBefore
}

//정산파트2//
const getAdjustmentsCalc = async (groupId: string) => {
  const GroupMemberSpendingsAfter = await getGroupMemberSpending(groupId)

  if (!GroupMemberSpendingsAfter) {
    throw new Error('No Spendings found: getAdjustments')
  }

  if (GroupMemberSpendingsAfter.some((obj) => obj.userSpending === null)) {
    throw new Error('Null Value error')
  }

  let Positives = GroupMemberSpendingsAfter.filter((obj) => obj.userSpending >= 0)
  let Negatives = GroupMemberSpendingsAfter.filter((obj) => obj.userSpending < 0)

  Positives = Positives.sort((a, b) => b.userSpending - a.userSpending)
  Negatives = Negatives.sort((a, b) => b.userSpending - a.userSpending) //내림차순 정렬 완료
  // console.log('내림차순 정렬 후 처음pos: ', Positives)
  // console.log('내림차순 정렬 후 처음neg: ', Negatives)

  while (Positives.length != 0 && Negatives.length != 0) {
    if (Math.abs(Positives[0].userSpending) <= 10 || Math.abs(Negatives[0].userSpending) <= 10) {
      //sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
      Negatives[0].userSpending = NaN
      Positives[0].userSpending = NaN
    } else {
      if (Math.abs(Positives[0].userSpending) > Math.abs(Negatives[0].userSpending)) {
        sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Math.abs(Negatives[0].userSpending))
        Positives[0].userSpending += Negatives[0].userSpending
        Negatives[0].userSpending = NaN

      } else if (Math.abs(Positives[0].userSpending) < Math.abs(Negatives[0].userSpending)) {
        sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending)
        Negatives[0].userSpending += Positives[0].userSpending
        Positives[0].userSpending = NaN
      }

      else if(Math.abs(Positives[0].userSpending) == Math.abs(Negatives[0].userSpending)){
        sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
        Negatives[0].userSpending = NaN;
        Positives[0].userSpending = NaN;
      }
      Positives = Positives.filter((obj) => !isNaN(obj.userSpending))
      Negatives = Negatives.filter((obj) => !isNaN(obj.userSpending))

      Positives = Positives.sort((a, b) => b.userSpending - a.userSpending)
      Negatives = Negatives.sort((a, b) => b.userSpending - a.userSpending)

      // console.log('whilepos', Positives)
      // console.log('whileneg', Negatives)
    }
  }
  return 0
}

const sendToAdjustments = async (groupId: string, fromId: string, toId: string, change: number) => {
  //const Adjustment =
  await prisma.adjustment.create({
    data: {
      groupId: groupId,
      plusUserId: toId,
      minusUserId: fromId,
      change: change,
    },
  })
}

const takeFromAdjustments = async (groupId: string) => {
  const Adjustment = await prisma.adjustment.findMany({
    select: {
      plusUserId: true,
      minusUserId: true,
      change: true,
    },
    where: {
      groupId: groupId,
    },
  })
  //return Adjustment

  const AdjustmentToReturn: {plusUserName:string; plusUserColor:string; minusUserName:string; minusUserColor:string; change:number }[] =[];

  await Promise.all(

    
    Adjustment.map(async (record) => {

      if(!record.plusUserId || !record.minusUserId){
            throw new Error('Null Error: Adjustment to Return')
      }

      let plusUserName = await UserService.getUserNameByUserId(record.plusUserId)
      let plusUserColor = await UserService.findUserColorByUserId(record.plusUserId)
      let minusUserName = await UserService.getUserNameByUserId(record.minusUserId)
      let minusUserColor = await UserService.findUserColorByUserId(record.plusUserId)
      let change = record.change

      AdjustmentToReturn.push({
        plusUserName, plusUserColor,minusUserName,minusUserColor,change
      })
    }),
  )
  return AdjustmentToReturn;
}


//adjustment 지우기 -> 정산 완료 눌렀을 때 사용할 것..-> isDone을 주자.. 
// const deleteAdjustment = async (groupId: string) => {
//   await prisma.adjustment.deleteMany({
//     where: {
//       groupId: groupId,
//     },
//   })
//   return 0
// }

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
  return lastday.createdAt;
}
const isDone = async (groupId: string) =>{
  await prisma.userSpendings.updateMany({
    where:{
      groupId : groupId,
      isDone : false
    },
    data:{
      isDone: true
    }
})
}

const getAdjustments = async (groupId: string) => {
  const AdjustedResult = await takeFromAdjustments(groupId)
  const LastCalculatedDate = await getDayReturn(groupId)

  await isDone(groupId);

  return { LastCalculatedDate, AdjustedResult }
}





const finalAdjustment = async(groupId: string) =>{
  let final1 = await getAdjustmentsCalc(groupId)
  let final = await getAdjustments(groupId);
  
  console.log(final1, final)
  
}
//finalAdjustment('aaaaab')



export {
  createBudget,
  showBudget,
  updateBudget,
  deleteBudget,
  getGroupMemberSpending,
  //getDayReturn,
  //updateSubCategory,
  //updateNewSubCategory,
  //takeFromAdjustments,
  //sendToAdjustments,
  //getAdjustmentsCalc,
  getAdjustments,
  searchBudget,
  createSubCategory,
  showSubCategory,
  finalAdjustment
}

// 서브카테고리 수정
// const updateSubCategory = async(budgetId: number, subCategory:string)=>{
//   if(!subCategory){
//     throw new Error('no such category found: updateSubCategory');
//   }
//   const subCategoryId = await findSubCategIdByName(subCategory);
//   const newBudget = await prisma.userSpendings.update({
//     where:{
//       id : budgetId,
//     },
//     data:{
//       subCategoryId: subCategoryId,
//     }
//   });

//   //return newBudget;
//   const UserName = await UserService.getUserNameByUserId(newBudget.userId);
//   const UserColor = await findUserColorByUserId(newBudget.userId);
//   const resCategory = await changeCategIdToName(newBudget.categoryId);
//   const resSubCategory = await changeSubCategIdToName(newBudget.subCategoryId);
//   const budgetToReturn : BudgetCreateResponseDto={
//     userColor: UserColor,
//     userName: UserName,
//     createdAt: newBudget.createdAt,
//     spendings: newBudget.spendings,
//     spendingName: newBudget.spendingName,
//     id: newBudget.id,
//     category: resCategory,
//     subCategory: resSubCategory
//   };
//   return budgetToReturn;
// }
