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
exports.isCalculating = exports.getBudget = exports.deleteSubCategory = exports.showByCategory = exports.AdjAtBudget = exports.showSubCategory = exports.createSubCategory = exports.searchBudget = exports.getAdjustments = exports.isDone = exports.getAdjustmentsCalc = exports.getGroupMemberSpending = exports.deleteBudget = exports.updateBudget = exports.showBudget = exports.createBudget = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GroupServiceUtils_1 = require("../Group/GroupServiceUtils");
const UserServiceUtils = __importStar(require("../User/UserServiceUtils"));
const GroupServiceUtils = __importStar(require("../Group/GroupServiceUtils"));
const BudgetServiceUtils = __importStar(require("../Budget/BudgetServiceUtils"));
const NotificationService = __importStar(require("../NotificationService"));
// -------------real service----------------
// 지출 등록
const createBudget = (userId, groupId, budgetCreateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServiceUtils.findUserById(userId);
        const group = yield GroupServiceUtils.findGroupById(groupId);
        const reqCategoryId = yield BudgetServiceUtils.findCategIdByName(budgetCreateRequestDto.category);
        const reqSubCategoryId = yield BudgetServiceUtils.findSubCategIdByName(budgetCreateRequestDto.subCategory, groupId, reqCategoryId);
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
        yield NotificationService.makeNotification(groupId, userId, "createBudget");
        // categoryId와 subCategoryId 변환
        const resCategory = yield BudgetServiceUtils.changeCategIdToName(event.categoryId);
        const resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(event.subCategoryId);
        const resUserColor = yield UserServiceUtils.findUserColorByUserId(event.userId);
        const resUserName = yield UserServiceUtils.getUserNameByUserId(event.userId);
        const createdBudget = {
            id: event.id,
            userId: event.userId,
            groupId: event.groupId,
            spendingName: event.spendingName,
            spendings: event.spendings,
            category: resCategory,
            subCategory: resSubCategory,
            userColor: resUserColor,
            userName: resUserName,
            createdAt: event.createdAt,
            isDone: event.isDone
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
            where: {
                groupId: groupId,
            },
            orderBy: {
                id: 'desc',
            }
        });
        let BudgetsToShow = [];
        yield Promise.all(Budgets.map((budget) => __awaiter(void 0, void 0, void 0, function* () {
            let resCategory = yield BudgetServiceUtils.changeCategIdToName(budget.categoryId);
            let resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(budget.subCategoryId);
            let resUserColor = yield UserServiceUtils.findUserColorByUserId(budget.userId);
            let resUserName = yield UserServiceUtils.getUserNameByUserId(budget.userId);
            BudgetsToShow.push({
                id: budget.id,
                userId: budget.userId,
                groupId: budget.groupId,
                spendingName: budget.spendingName,
                spendings: budget.spendings,
                category: resCategory,
                subCategory: resSubCategory,
                userColor: resUserColor,
                userName: resUserName,
                createdAt: budget.createdAt,
                isDone: budget.isDone
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
const updateBudget = (budgetId, groupId, BudgetUpdateRequestDto) => __awaiter(void 0, void 0, void 0, function* () {
    let categoryId = yield BudgetServiceUtils.findCategIdByName(BudgetUpdateRequestDto.category);
    try {
        const updatedBudget = yield prisma.userSpendings.update({
            where: {
                id: budgetId,
            },
            data: {
                spendingName: BudgetUpdateRequestDto.spendingName,
                spendings: BudgetUpdateRequestDto.spending,
                categoryId: categoryId,
                subCategoryId: yield BudgetServiceUtils.findSubCategIdByName(BudgetUpdateRequestDto.subCategory, groupId, categoryId),
            },
        });
        const UserName = yield UserServiceUtils.getUserNameByUserId(updatedBudget.userId);
        const UserColor = yield UserServiceUtils.findUserColorByUserId(updatedBudget.userId);
        const resCategory = yield BudgetServiceUtils.changeCategIdToName(updatedBudget.categoryId);
        const resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(updatedBudget.subCategoryId);
        const budgetToReturn = {
            userColor: UserColor,
            userName: UserName,
            id: updatedBudget.id,
            userId: updatedBudget.userId,
            groupId: updatedBudget.groupId,
            createdAt: updatedBudget.createdAt,
            spendings: updatedBudget.spendings,
            spendingName: updatedBudget.spendingName,
            category: resCategory,
            subCategory: resSubCategory,
            isDone: updatedBudget.isDone
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
//지출내역 한 개 반환
const getBudget = (BudgetId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Budget = yield prisma.userSpendings.findUnique({
            where: {
                id: BudgetId
            }
        });
        const userId = Budget === null || Budget === void 0 ? void 0 : Budget.userId;
        if (!userId) {
            return "User Not Found : getBudget";
        }
        const resName = yield UserServiceUtils.getUserNameByUserId(userId);
        const resColor = yield UserServiceUtils.findUserColorByUserId(userId);
        const resCategory = yield BudgetServiceUtils.changeCategIdToName(Budget.categoryId);
        const resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(Budget.subCategoryId);
        const budgetToReturn = {
            userColor: resColor,
            userName: resName,
            id: Budget.id,
            userId: Budget.userId,
            groupId: Budget.groupId,
            createdAt: Budget.createdAt,
            spendings: Budget.spendings,
            spendingName: Budget.spendingName,
            category: resCategory,
            subCategory: resSubCategory,
            isDone: Budget.isDone
        };
        return budgetToReturn;
    }
    catch (error) {
        throw new Error('error :: service/budget/getBudget');
    }
});
exports.getBudget = getBudget;
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
            let resUserColor = yield UserServiceUtils.findUserColorByUserId(budget.userId);
            let resUserName = yield UserServiceUtils.getUserNameByUserId(budget.userId);
            BudgetsToShow.push({
                id: budget.id,
                userId: budget.userId,
                groupId: budget.groupId,
                spendingName: budget.spendingName,
                spendings: budget.spendings,
                category: resCategory,
                subCategory: resSubCategory,
                userColor: resUserColor,
                userName: resUserName,
                createdAt: budget.createdAt,
                isDone: budget.isDone
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
const createSubCategory = (groupId, categoryId, subCategoryName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const duplicateName = yield prisma.subCategory.findMany({
            where: {
                groupId: groupId,
                categoryId: categoryId,
                name: subCategoryName
            }
        });
        if (duplicateName.length > 0) {
            throw new Error("같은 카테고리 내에 중복된 서브 카테고리를 등록할 수 없습니다.");
        }
        else {
            const newSubCategory = yield prisma.subCategory.create({
                data: {
                    name: subCategoryName,
                    groupId: groupId,
                    categoryId: categoryId,
                },
            });
            return newSubCategory;
        }
    }
    catch (error) {
        console.error('subcategory create failed', error);
        throw error;
    }
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
//서브카테고리 지우기
const deleteSubCategory = (groupId, categoryName, subCategoryName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = yield BudgetServiceUtils.findCategIdByName(categoryName);
        const subCategory = yield prisma.subCategory.findMany({
            where: {
                groupId: groupId,
                categoryId: categoryId,
                name: subCategoryName
            }
        });
        if (subCategory.length < 1) {
            throw new Error('Subcategory not found');
        }
        yield prisma.subCategory.delete({
            where: {
                id: subCategory[0].id
            }
        });
        return 0;
    }
    catch (error) {
        console.error('subcategory delete failed at service level', error);
        throw error;
    }
});
exports.deleteSubCategory = deleteSubCategory;
//카테고리별 정렬+검색
const showByCategory = (groupId, category) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = yield BudgetServiceUtils.findCategIdByName(category);
    const budgetsToShow = yield prisma.userSpendings.findMany({
        where: {
            groupId: groupId,
            categoryId: categoryId
        }
    });
    let BudgetsToShow = [];
    yield Promise.all(budgetsToShow.map((budget) => __awaiter(void 0, void 0, void 0, function* () {
        let resCategory = yield BudgetServiceUtils.changeCategIdToName(budget.categoryId);
        let resSubCategory = yield BudgetServiceUtils.changeSubCategIdToName(budget.subCategoryId);
        let resUserColor = yield UserServiceUtils.findUserColorByUserId(budget.userId);
        let resUserName = yield UserServiceUtils.getUserNameByUserId(budget.userId);
        BudgetsToShow.push({
            id: budget.id,
            userId: budget.userId,
            groupId: budget.groupId,
            spendingName: budget.spendingName,
            spendings: budget.spendings,
            category: resCategory,
            subCategory: resSubCategory,
            userColor: resUserColor,
            userName: resUserName,
            createdAt: budget.createdAt,
            isDone: budget.isDone
        });
    })));
    return BudgetsToShow;
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
    yield Promise.all(userSpendings.map((budget) => __awaiter(void 0, void 0, void 0, function* () {
        let resUserColor = yield UserServiceUtils.findUserColorByUserId(budget.userId);
        let resUserName = yield UserServiceUtils.getUserNameByUserId(budget.userId);
        let spending = budget._sum.spendings;
        if (spending == null) {
            throw new Error('Null error: groupMemberSpendings');
        }
        groupMemberSpendingsBefore.push({
            userId: budget.userId,
            userColor: resUserColor,
            userName: resUserName,
            userSpending: spending
        });
    })));
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
        //const groupOwner = await UserServiceUtils.findGroupOwner(groupId)
        // 알림 생성
        //await NotificationService.makeNotification(groupId, groupOwner, "createSchedule")
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
//정산알림보내기
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
    // 정산을 시작했습니다 알림 생성
    const groupOwner = yield UserServiceUtils.findGroupOwner(groupId);
    yield NotificationService.makeNotification(groupId, groupOwner, "startBudget");
    return "정산하는 중이에요!";
});
exports.getAdjustmentsCalc = getAdjustmentsCalc;
const sendToAdjustments = (groupId, fromId, toId, change) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.adjustment.create({
        data: {
            groupId: groupId,
            plusUserId: toId,
            minusUserId: fromId,
            change: change,
            isDone: false
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
            isDone: false
        },
    });
    console.log(Adjustment);
    const AdjustmentToReturn = [];
    yield Promise.all(Adjustment.map((record) => __awaiter(void 0, void 0, void 0, function* () {
        if (!record.plusUserId || !record.minusUserId) {
            throw new Error('Null Error: Adjustment to Return');
        }
        let plusUserId = record.plusUserId;
        let plusUserName = yield UserServiceUtils.getUserNameByUserId(record.plusUserId);
        let plusUserColor = yield UserServiceUtils.findUserColorByUserId(record.plusUserId);
        let minusUserId = record.minusUserId;
        let minusUserName = yield UserServiceUtils.getUserNameByUserId(record.minusUserId);
        let minusUserColor = yield UserServiceUtils.findUserColorByUserId(record.minusUserId);
        let change = record.change;
        AdjustmentToReturn.push({
            plusUserId,
            plusUserName,
            plusUserColor,
            minusUserId,
            minusUserName,
            minusUserColor,
            change,
        });
    })));
    return AdjustmentToReturn;
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
    return lastday.createdAt;
});
// 정산완료 버튼(isDone update되고, 알림도 줌)
const isDone = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.userSpendings.updateMany({
            where: {
                groupId: groupId,
                isDone: false,
            },
            data: {
                isDone: true,
            },
        });
        yield prisma.adjustment.updateMany({
            where: {
                groupId: groupId,
                isDone: false
            },
            data: {
                isDone: true
            }
        });
        const groupOwner = yield UserServiceUtils.findGroupOwner(groupId);
        // 알림 생성
        yield NotificationService.makeNotification(groupId, groupOwner, "endBudget");
        return console.log('Successfully updated the isDone status!');
    }
    catch (error) {
        console.error('error :: service/budgetsercive/isDone', error);
        throw error;
    }
});
exports.isDone = isDone;
//정산 알림 내역
const getAdjustments = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const AdjustedResult = yield takeFromAdjustments(groupId);
    const LastCalculatedDate = yield getDayReturn(groupId);
    return { LastCalculatedDate, AdjustedResult };
});
exports.getAdjustments = getAdjustments;
/*
const finalAdjustment = async (groupId: string) => {
  await getAdjustmentsCalc(groupId);
  await delay(1000);
  
  const final = await getAdjustments(groupId);

  return {final}
}
*/
const isCalculating = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isCalculating = yield prisma.adjustment.findMany({
            where: {
                groupId: groupId,
                isDone: false
            }
        });
        if (!isCalculating) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        console.error('error :: service/budgetsercive/isCalculating', error);
        throw error;
    }
});
exports.isCalculating = isCalculating;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=BudgetService.js.map