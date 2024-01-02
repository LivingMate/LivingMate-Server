"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdjustments = exports.getAdjustmentsCalc = exports.sendToAdjustments = exports.takeFromAdjustments = exports.getDayReturn = exports.getGroupMemberSpending = exports.showBudget = exports.createBudget = exports.changeSubCategIdToName = exports.changeCategIdToName = exports.findUserColorByUserId = exports.findSubCategIdByName = exports.findCategIdByName = exports.findGroupById = exports.findUserById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GroupService_1 = require("./GroupService");
const UserService_1 = require("./UserService");
const message_1 = __importDefault(require("../modules/message"));
// ------------utils-------------
// 유저 찾기
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId');
    }
    const data = yield prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!data) {
        throw new Error(message_1.default.UNAUTHORIZED);
    }
    return data;
});
exports.findUserById = findUserById;
// 그룹 찾기
const findGroupById = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield prisma.group.findUnique({
        where: {
            id: groupId,
        },
    });
    if (!group) {
        throw new Error(message_1.default.UNAUTHORIZED);
    }
    return group;
});
exports.findGroupById = findGroupById;
// 카테고리 이름으로 아이디 찾기
const findCategIdByName = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    // userId가 정의되어 있지 않거나 문자열이 아닌 경우 에러 발생
    if (!categoryName || typeof categoryName !== 'string') {
        throw new Error('Invalid categoryName');
    }
    const data = yield prisma.category.findUnique({
        where: {
            name: categoryName,
        },
    });
    if (!data) {
        throw new Error(message_1.default.UNAUTHORIZED);
    }
    return data.id;
});
exports.findCategIdByName = findCategIdByName;
// 섭카테고리 이름으로 섭카테고리 id 찾기
function findSubCategIdByName(subCategoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subCategory = yield prisma.subCategory.findUnique({
                where: {
                    name: subCategoryName,
                },
            });
            if (subCategory) {
                return subCategory.id;
            }
            else {
                return -1;
            }
        }
        catch (error) {
            console.error('Error in findSubCategIdByName:', error);
            throw error;
        }
    });
}
exports.findSubCategIdByName = findSubCategIdByName;
// userId로 userColor 찾기
const findUserColorByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (data) {
            return data.userColor;
        }
        else {
            return 'error';
        }
    }
    catch (error) {
        console.error('error :: service/budget/findUserColorByUserId', error);
        throw error;
    }
});
exports.findUserColorByUserId = findUserColorByUserId;
// id를 name으로 반환
function changeCategIdToName(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });
            if (result) {
                return result.name;
            }
            else {
                return 'error';
            }
        }
        catch (error) {
            console.error('Error in changeCategIdByName:', error);
            throw error;
        }
    });
}
exports.changeCategIdToName = changeCategIdToName;
// subId를 name으로 반환
function changeSubCategIdToName(subCategoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield prisma.subCategory.findUnique({
                where: {
                    id: subCategoryId,
                },
            });
            if (result) {
                return result.name;
            }
            else {
                return 'error';
            }
        }
        catch (error) {
            console.error('Error in changeSubCategIdByName:', error);
            throw error;
        }
    });
}
exports.changeSubCategIdToName = changeSubCategIdToName;
// -------------real service----------------
// 지출 등록
const createBudget = (userId, groupId, budgetCreateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield findUserById(userId);
        const group = yield findGroupById(groupId);
        const reqCategoryId = yield findCategIdByName(budgetCreateRequestDto.category);
        const reqSubCategoryId = yield findSubCategIdByName(budgetCreateRequestDto.subCategory);
        yield (0, GroupService_1.checkForbiddenGroup)(user.groupId, groupId);
        const event = yield prisma.userSpendings.create({
            data: {
                userId: userId,
                groupId: groupId,
                spendingName: budgetCreateRequestDto.spendingName,
                spendings: budgetCreateRequestDto.spendings,
                categoryId: reqCategoryId,
                subCategoryId: reqSubCategoryId,
            },
        });
        // categoryId와 subCategoryId 변환
        const resCategory = yield changeCategIdToName(event.categoryId);
        const resSubCategory = yield changeSubCategIdToName(event.subCategoryId);
        const resUserColor = yield findUserColorByUserId(event.userId);
        const resUserName = yield (0, UserService_1.getUserNameByUserId)(event.userId);
        const createdBudget = {
            spendingName: event.spendingName,
            spendings: event.spendings,
            category: resCategory,
            subCategory: resSubCategory,
            userColor: resUserColor,
            userName: resUserName,
            createdAt: event.createdAt,
        };
        return createdBudget;
    }
    catch (error) {
        console.error('error :: service/budget/createBudget', error);
        throw error;
    }
});
exports.createBudget = createBudget;
//지출내역 보여주기
const showBudget = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Budgets = yield prisma.userSpendings.findMany({
            take: 10,
            where: {
                groupId: groupId,
            },
        });
        return Budgets;
    }
    catch (error) {
        console.error('error :: service/budget/showBudget', error);
        throw error;
    }
});
exports.showBudget = showBudget;
// //지출내역 보여주기
// const showBudget = async (groupId: string) => {
//   try{
//     const Budgets = await prisma.userSpendings.findMany({
//       take: 10,
//       where: {
//         groupId: groupId,
//       },
//     })
//     return Budgets
//   } catch(error) {
//     console.error('error :: service/budget/showBudget', error)
//     throw error
//   }
// }
/*
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
    return updatedBudget;
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
    return 0
  } catch (error) {
    throw new Error('error :: service/budget/deleteBudget')
  }
}
//showBudget에 따라서 + 이런저런 사정에 따라서 파라미터로 받는게 GroupId가 될 수도 있고 DTO가 될 수도 있구나..
// 그러면 수정 해줘야해...

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
  } catch (error) {
  throw new Error('error :: service/budget/searchBudget')
  }
}

/*
// 서브카테고리 수정
const updateSubCategory = async(budgetId: number, subCategory:string)=>{
  if(!subCategory){
    throw new Error('no such category found: updateSubCategory')
  }

  const newBudget = await prisma.userSpendings.update({
    where:{
      id : budgetId,
    },
    data:{
      subCategoryId: subCategory,
    }
  })

  return newBudget;
}
*/
// 서브카테고리 삭제
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
const getGroupMemberSpending = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const GroupSpending = yield prisma.userSpendings.groupBy({
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
    }); //그룹 썸 구하기
    for (const group of GroupSpending) {
        const groupId = group.groupId;
        const groupSum = group._sum.spendings;
        const groupAvg = group._avg.spendings;
        let groupMemberSpendings = [];
        groupMemberSpendings = yield getUserSpending(groupId);
        groupMemberSpendings.forEach((member) => {
            if (member.userSpending == null || groupAvg == null) {
                throw new Error('Null Error: getGroupSpending');
            }
            member.userSpending -= groupAvg;
        });
        return groupMemberSpendings; //각 지출액 - 그룹 평균 지출액 값 반환함
    }
});
exports.getGroupMemberSpending = getGroupMemberSpending;
const getUserSpending = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const userSpendings = yield prisma.userSpendings.groupBy({
        by: ['userId'],
        _sum: {
            spendings: true,
        },
        where: {
            groupId: groupId,
            isDone: false,
        },
    });
    const groupMemberSpendingsBefore = [];
    userSpendings.forEach((record) => {
        const userId = record.userId;
        const userSpending = record._sum.spendings;
        if (userSpending == null) {
            throw new Error('Null error: groupMemberSpendings');
        }
        groupMemberSpendingsBefore.push({ userId, userSpending });
    });
    return groupMemberSpendingsBefore;
});
//정산 파트2 : 누가 누구한테 얼마나 주면 될까요?
const getAdjustmentsCalc = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const GroupMemberSpendingsAfter = yield getGroupMemberSpending(groupId);
    //{userId,userSpending-AvgGroupSpending}[] 모양
    if (!GroupMemberSpendingsAfter) {
        throw new Error("No Spendings found: getAdjustments");
    }
    if (GroupMemberSpendingsAfter.some(obj => obj.userSpending === null)) {
        throw new Error('Null Value error');
    }
    let Positives = GroupMemberSpendingsAfter.filter(obj => obj.userSpending >= 0);
    let Negatives = GroupMemberSpendingsAfter.filter(obj => obj.userSpending < 0);
    Positives = Positives.sort((a, b) => b.userSpending - a.userSpending);
    Negatives = Negatives.sort((a, b) => b.userSpending - a.userSpending); //내림차순 정렬 완료
    while (!isNaN(Positives[0].userSpending) && !isNaN(Negatives[0].userSpending)) {
        //Positives = Positives.filter(obj => obj.userSpending != null);
        //Negatives = Negatives.filter(obj => obj.userSpending != null);
        if (Positives[0].userSpending > Negatives[0].userSpending) {
            sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Negatives[0].userSpending);
            Positives[0].userSpending += Negatives[0].userSpending;
            Negatives[0].userSpending = NaN;
        }
        else if (Positives[0].userSpending < Negatives[0].userSpending) {
            sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
            Negatives[0].userSpending += Positives[0].userSpending;
            Positives[0].userSpending = NaN;
        }
        else {
            sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
            Negatives[0].userSpending = NaN;
            Positives[0].userSpending = NaN;
        }
        Positives = Positives.sort((a, b) => b.userSpending - a.userSpending);
        Negatives = Negatives.sort((a, b) => b.userSpending - a.userSpending);
    }
    return 0;
});
exports.getAdjustmentsCalc = getAdjustmentsCalc;
const sendToAdjustments = (groupId, fromId, toId, change) => __awaiter(void 0, void 0, void 0, function* () {
    const Adjustment = yield prisma.adjustment.create({
        data: {
            groupId: groupId,
            plusUserId: toId,
            minusUserId: fromId,
            change: change
        }
    });
});
exports.sendToAdjustments = sendToAdjustments;
//근데 여기서 2번 이상 레코드로 적힌 애들 중에 뭐가 진짜 마지막 계산 결과인지를 알아내지? => 두 번 이상 안 적히나?
// Distinction으로 묶어내고.. 그런데 distinction으로 묶을 기준을 알기 어려움. 무슨 말이냐면.. 어디부터 어디까지가 distinction id 1로 쳐 질건데?
// 아니면 한 그룹에서 정산을 이어서 여러번 하지 않을 확률이 높다는 걸 가지고 같은 날짜에 이루어진 transaction만 뽑아내는 방법도 있음
// 이거 괜찮을 것 같아. 그리고 "정산은 하루에 1회만 가능합니다." 라고 못박아두자 
//정산 완료를 누르면 adjustment 지워버리기...
const takeFromAdjustments = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const Adjustment = yield prisma.adjustment.findMany({
        select: {
            plusUserId: true,
            minusUserId: true,
            change: true
        },
        where: {
            groupId: groupId,
        }
    });
    return Adjustment;
});
exports.takeFromAdjustments = takeFromAdjustments;
//userId 별로 보여줘야 함
// show Category
//adjustment 지우기 -> 정산 완료 눌렀을 때 사용할 것.. 
const deleteAdjustment = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const AdjustmentDeletion = yield prisma.adjustment.deleteMany({
        where: {
            groupId: groupId
        }
    });
    return 0;
});
//정산 마이너 기능 (날짜 반환)
const getDayReturn = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const lastday = yield prisma.userSpendings.findFirst({
        where: {
            groupId: groupId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!lastday) {
        throw new Error('Error in retrieving date: dayreturn');
    }
    return lastday;
});
exports.getDayReturn = getDayReturn;
const getAdjustments = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const AdjustedResult = yield takeFromAdjustments(groupId);
    const LastCalculatedDate = yield getDayReturn(groupId);
    return { LastCalculatedDate, AdjustedResult };
});
exports.getAdjustments = getAdjustments;
//# sourceMappingURL=BudgetService.js.map