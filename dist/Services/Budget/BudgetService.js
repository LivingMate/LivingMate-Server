"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showByCategory = exports.AdjAtBudget = exports.finalAdjustment = exports.showSubCategory = exports.createSubCategory = exports.searchBudget = exports.getAdjustments = exports.getGroupMemberSpending = exports.deleteBudget = exports.updateBudget = exports.showBudget = exports.createBudget = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GroupServiceUtils_1 = require("../Group/GroupServiceUtils");
const UserServiceUtils = __importStar(require("../User/UserServiceUtils"));
const GroupServiceUtils = __importStar(require("../Group/GroupServiceUtils"));
const BudgetServiceUtils = __importStar(require("../Budget/BudgetServiceUtils"));
// -------------real service----------------
// 지출 등록
const createBudget = (userId, groupId, budgetCreateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(groupId);
        const reqCategoryId = yield BudgetServiceUtils.findCategIdByName(budgetCreateRequestDto.category);
        const reqSubCategoryId = yield BudgetServiceUtils.findSubCategIdByName(budgetCreateRequestDto.subCategory);
        yield (0, GroupServiceUtils_1.checkForbiddenGroup)(user.groupId, groupId);
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
        const resCategory = yield BudgetServiceUtils.changeCategIdToName(event.categoryId);
        const resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(event.subCategoryId);
        //const resUserColor = await UserService.findUserColorByUserId(event.userId)
        //const resUserName = await UserService.getUserNameByUserId(event.userId)
        const createdBudget = {
            id: event.id,
            userId: event.userId,
            groupId: event.groupId,
            spendingName: event.spendingName,
            spendings: event.spendings,
            category: resCategory,
            subCategory: resSubCategory,
            //userColor: resUserColor,
            //userName: resUserName,
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
        let BudgetsToShow = [];
        yield Promise.all(Budgets.map((budget) => __awaiter(void 0, void 0, void 0, function* () {
            let resCategory = yield BudgetServiceUtils.changeCategIdToName(budget.categoryId);
            let resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(budget.subCategoryId);
            //let resUserColor = await UserService.findUserColorByUserId(budget.userId)
            //let resUserName = await UserService.getUserNameByUserId(budget.userId)
            BudgetsToShow.push({
                id: budget.id,
                userId: budget.userId,
                groupId: budget.groupId,
                spendingName: budget.spendingName,
                spendings: budget.spendings,
                category: resCategory,
                subCategory: resSubCategory,
                //userColor: resUserColor,
                //userName: resUserName,
                createdAt: budget.createdAt,
            });
        })));
        return BudgetsToShow;
    }
    catch (error) {
        console.error('error :: service/budget/showBudget', error);
        throw error;
    }
});
exports.showBudget = showBudget;
//지출내역 수정
const updateBudget = (budgetId, BudgetUpdateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedBudget = yield prisma.userSpendings.update({
            where: {
                id: budgetId,
            },
            data: {
                spendingName: BudgetUpdateRequestDto.spendingName,
                spendings: BudgetUpdateRequestDto.spending,
                categoryId: yield BudgetServiceUtils.findCategIdByName(BudgetUpdateRequestDto.category),
                subCategoryId: yield BudgetServiceUtils.findSubCategIdByName(BudgetUpdateRequestDto.subCategory),
            },
        });
        //return updatedBudget;
        //const UserName = await UserService.getUserNameByUserId(updatedBudget.userId)
        //const UserColor = await UserService.findUserColorByUserId(updatedBudget.userId)
        const resCategory = yield BudgetServiceUtils.changeCategIdToName(updatedBudget.categoryId);
        const resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(updatedBudget.subCategoryId);
        const budgetToReturn = {
            //userColor: UserColor,
            //userName: UserName,
            id: updatedBudget.id,
            userId: updatedBudget.userId,
            groupId: updatedBudget.groupId,
            createdAt: updatedBudget.createdAt,
            spendings: updatedBudget.spendings,
            spendingName: updatedBudget.spendingName,
            category: resCategory,
            subCategory: resSubCategory,
        };
        return budgetToReturn;
    }
    catch (error) {
        throw new Error('error :: service/budget/updateBudgetContent');
    }
});
exports.updateBudget = updateBudget;
//지출내역 삭제
const deleteBudget = (BudgetId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.userSpendings.delete({
            where: {
                id: BudgetId,
            },
        });
        return 0;
    }
    catch (error) {
        throw new Error('error :: service/budget/deleteBudget');
    }
});
exports.deleteBudget = deleteBudget;
//지출내역 검색
const searchBudget = (groupId, searchKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchedBudget = yield prisma.userSpendings.findMany({
            where: {
                groupId: groupId,
                spendingName: {
                    contains: searchKey,
                },
            },
        });
        let BudgetsToShow = [];
        yield Promise.all(searchedBudget.map((budget) => __awaiter(void 0, void 0, void 0, function* () {
            let resCategory = yield BudgetServiceUtils.changeCategIdToName(budget.categoryId);
            let resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(budget.subCategoryId);
            //let resUserColor = await UserService.findUserColorByUserId(budget.userId)
            //let resUserName = await UserService.getUserNameByUserId(budget.userId)
            BudgetsToShow.push({
                id: budget.id,
                userId: budget.userId,
                groupId: budget.groupId,
                spendingName: budget.spendingName,
                spendings: budget.spendings,
                category: resCategory,
                subCategory: resSubCategory,
                //userColor: resUserColor,
                //userName: resUserName,
                createdAt: budget.createdAt,
            });
        })));
        return BudgetsToShow;
    }
    catch (error) {
        throw new Error('error :: service/budget/searchBudget');
    }
});
exports.searchBudget = searchBudget;
// 서브카테고리 새로 만들기 // categoryName-<id
const createSubCategory = (groupId, categoryId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const newSubCategory = yield prisma.subCategory.create({
        data: {
            name: name,
            groupId: groupId,
            categoryId: categoryId,
        },
    });
    return newSubCategory;
});
exports.createSubCategory = createSubCategory;
//서브카테고리 보여주기
const showSubCategory = (groupId, categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = yield BudgetServiceUtils.findCategIdByName(categoryName);
    const SubCategories = yield prisma.subCategory.findMany({
        select: {
            name: true,
        },
        where: {
            groupId: groupId,
            categoryId: categoryId,
        },
    });
    return SubCategories;
});
exports.showSubCategory = showSubCategory;
//카테고리별 정렬+검색
const showByCategory = (groupId, category) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = yield BudgetServiceUtils.findCategIdByName(category);
    const budgetsToShow = yield prisma.userSpendings.findMany({
        where: {
            groupId: groupId,
            categoryId: categoryId
        }
    });
    return budgetsToShow;
});
exports.showByCategory = showByCategory;
//정산파트1 최종함수//
//각 지출액 - 그룹 평균 지출액 값 반환
const getGroupMemberSpending = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const GroupSpending = yield prisma.userSpendings.groupBy({
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
    });
    for (const group of GroupSpending) {
        const groupId = group.groupId;
        const groupSum = group._sum.spendings;
        if (!groupSum) {
            throw new Error('groupSum Error: Null');
        }
        const memberNum = yield getMemberNumber(groupId);
        if (!memberNum) {
            throw new Error('memberNum Error: Null');
        }
        const groupAvg = Math.round(groupSum / memberNum);
        let groupMemberSpendings = [];
        groupMemberSpendings = yield getUserSpending(groupId);
        groupMemberSpendings.forEach((member) => {
            if (member.userSpending == null || groupAvg == null) {
                throw new Error('Null Error: getGroupMemberSpending');
            }
            member.userSpending -= groupAvg;
        });
        //console.log('각 지출액 - 그룹 평균 지출액:', groupMemberSpendings)
        return groupMemberSpendings;
    }
});
exports.getGroupMemberSpending = getGroupMemberSpending;
const getMemberNumber = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const memberNum = yield prisma.user.groupBy({
        by: ['groupId'],
        where: {
            groupId: groupId,
        },
        _count: {
            _all: true,
        },
    });
    let memberNumInt;
    memberNum.forEach((member) => {
        memberNumInt = member._count._all;
    });
    return memberNumInt;
});
//각 유저의 지출액 합
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
//가계부 내부 정산 반환 함수
const AdjAtBudget = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const GroupSpending = yield prisma.userSpendings.groupBy({
        by: ['groupId'],
        where: {
            groupId: groupId,
            isDone: false,
        },
        _sum: {
            spendings: true,
        },
    });
    for (const group of GroupSpending) {
        const groupId = group.groupId;
        const groupSum = group._sum.spendings;
        if (!groupSum) {
            throw new Error('groupSum Error: Null');
        }
        const memberNum = yield getMemberNumber(groupId);
        if (!memberNum) {
            throw new Error('memberNum Error: Null');
        }
        const groupAvg = Math.round(groupSum / memberNum);
        let groupMemberSpendings2 = [];
        let groupMemberSpendings = [];
        groupMemberSpendings = yield getUserSpending(groupId);
        groupMemberSpendings2 = yield getUserSpending(groupId);
        groupMemberSpendings.forEach((member) => {
            if (member.userSpending == null || groupAvg == null) {
                throw new Error('Null Error: getGroupMemberSpending');
            }
            member.userSpending -= groupAvg;
        });
        return {
            groupAvg,
            groupSum,
            groupMemberSpendings,
            groupMemberSpendings2,
        };
    }
});
exports.AdjAtBudget = AdjAtBudget;
//정산파트2//
const getAdjustmentsCalc = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const GroupMemberSpendingsAfter = yield getGroupMemberSpending(groupId);
    if (!GroupMemberSpendingsAfter) {
        throw new Error('No Spendings found: getAdjustments');
    }
    if (GroupMemberSpendingsAfter.some((obj) => obj.userSpending === null)) {
        throw new Error('Null Value error');
    }
    let Positives = GroupMemberSpendingsAfter.filter((obj) => obj.userSpending >= 0);
    let Negatives = GroupMemberSpendingsAfter.filter((obj) => obj.userSpending < 0);
    Positives = Positives.sort((a, b) => b.userSpending - a.userSpending);
    Negatives = Negatives.sort((a, b) => b.userSpending - a.userSpending); //내림차순 정렬 완료
    // console.log('내림차순 정렬 후 처음pos: ', Positives)
    // console.log('내림차순 정렬 후 처음neg: ', Negatives)
    while (Positives.length != 0 && Negatives.length != 0) {
        if (Math.abs(Positives[0].userSpending) <= 10 || Math.abs(Negatives[0].userSpending) <= 10) {
            //sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
            Negatives[0].userSpending = NaN;
            Positives[0].userSpending = NaN;
        }
        else {
            if (Math.abs(Positives[0].userSpending) > Math.abs(Negatives[0].userSpending)) {
                sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Math.abs(Negatives[0].userSpending));
                Positives[0].userSpending += Negatives[0].userSpending;
                Negatives[0].userSpending = NaN;
            }
            else if (Math.abs(Positives[0].userSpending) < Math.abs(Negatives[0].userSpending)) {
                sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
                Negatives[0].userSpending += Positives[0].userSpending;
                Positives[0].userSpending = NaN;
            }
            else if (Math.abs(Positives[0].userSpending) == Math.abs(Negatives[0].userSpending)) {
                sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
                Negatives[0].userSpending = NaN;
                Positives[0].userSpending = NaN;
            }
            Positives = Positives.filter((obj) => !isNaN(obj.userSpending));
            Negatives = Negatives.filter((obj) => !isNaN(obj.userSpending));
            Positives = Positives.sort((a, b) => b.userSpending - a.userSpending);
            Negatives = Negatives.sort((a, b) => b.userSpending - a.userSpending);
            // console.log('whilepos', Positives)
            // console.log('whileneg', Negatives)
        }
    }
    return 0;
});
const sendToAdjustments = (groupId, fromId, toId, change) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.adjustment.create({
        data: {
            groupId: groupId,
            plusUserId: toId,
            minusUserId: fromId,
            change: change,
        },
    });
});
const takeFromAdjustments = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const Adjustment = yield prisma.adjustment.findMany({
        select: {
            plusUserId: true,
            minusUserId: true,
            change: true,
        },
        where: {
            groupId: groupId,
        },
    });
    /*
    const AdjustmentToReturn: {
      plusUserName: string
      plusUserColor: string
      minusUserName: string
      minusUserColor: string
      change: number
    }[] = []
  
    await Promise.all(
      Adjustment.map(async (record) => {
        if (!record.plusUserId || !record.minusUserId) {
          throw new Error('Null Error: Adjustment to Return')
        }
  
        let plusUserName = await UserService.getUserNameByUserId(record.plusUserId)
        let plusUserColor = await UserService.findUserColorByUserId(record.plusUserId)
        let minusUserName = await UserService.getUserNameByUserId(record.minusUserId)
        let minusUserColor = await UserService.findUserColorByUserId(record.plusUserId)
        let change = record.change
  
        AdjustmentToReturn.push({
          plusUserName,
          plusUserColor,
          minusUserName,
          minusUserColor,
          change,
        })
      }),
    )
    return AdjustmentToReturn
    */
    return Adjustment;
});
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
    return lastday.createdAt;
});
const isDone = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.userSpendings.updateMany({
        where: {
            groupId: groupId,
            isDone: false,
        },
        data: {
            isDone: true,
        },
    });
});
const getAdjustments = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const AdjustedResult = yield takeFromAdjustments(groupId);
    const LastCalculatedDate = yield getDayReturn(groupId);
    yield isDone(groupId);
    return { LastCalculatedDate, AdjustedResult };
});
exports.getAdjustments = getAdjustments;
const finalAdjustment = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    yield getAdjustmentsCalc(groupId);
    let final = yield getAdjustments(groupId);
    return { final };
});
exports.finalAdjustment = finalAdjustment;
//# sourceMappingURL=BudgetService.js.map