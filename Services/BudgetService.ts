import { PrismaClient } from '@prisma/client'
import { BudgetBaseDto } from '../DTOs/Budget/BudgetBaseDto'
import { BudgetCreateRequestDto } from '../DTOs/Budget/Request/BudgetCreateRequestDto'
import { BudgetUpdateRequestDto } from '../DTOs/Budget/Request/BudgetUpdateRequestDto'
const prisma = new PrismaClient()

//지출내역 등록
const createBudget = async (BudgetBaseDto: BudgetBaseDto) => {
  const newBudget = await prisma.userSpendings.create({
    data: {
      userId: BudgetBaseDto.userid,
      groupId: BudgetBaseDto.groupid,
      spendingName: BudgetBaseDto.name,
      spendings: BudgetBaseDto.spending,
      category: BudgetBaseDto.category, //모델이 []라서 오류가 생기는 거에용
    },
  })
  //리턴값 어케할지.. showBudget 할지.. 이거 정해야 행
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
//isDone도 보여지는지 확인해야 하네.. -> 되겠지!

//지출내역 수정
const updateBudgetContent = async (BudgetUpdateRequestDto: BudgetUpdateRequestDto) => {
  try {
    const updatedBudget = await prisma.userSpendings.update({
      where: {
        id: BudgetUpdateRequestDto.budgetId,
      },
      data: {
        spendings: BudgetUpdateRequestDto.spending,
        category: BudgetUpdateRequestDto.category,
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
  //showBudget
}
//showBudget에 따라서 + 이런저런 사정에 따라서 파라미터로 받는게 GroupId가 될 수도 있고 DTO가 될 수도 있구나..
// 그러면 수정 해줘야해...

//지출내역 검색
const searchBudget = async (searchKey: string) => {
  const searchedBudget = await prisma.userSpendings.findMany({
    where: {
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
      //category: budget.
    }
  })

  return results
}

//지출 합산 내역 반환
const getGroupSpending = async (BudgetId: string, groupId: string) => {
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
    return groupMemberSpendings
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

  const groupMemberSpendings: { userId: string; userSpending: number }[] = []

  userSpendings.forEach((record) => {
    const userId = record.userId
    const userSpending = record._sum.spendings

    if (userSpending == null) {
      throw new Error('Null error: groupMemberSpendings')
    }

    groupMemberSpendings.push({ userId, userSpending })
  })

  return groupMemberSpendings
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

  return lastday
}

export default {
  createBudget,
  showBudget,
  updateBudgetContent,
  deleteBudget,
  getGroupSpending,
  getDayReturn,
}
