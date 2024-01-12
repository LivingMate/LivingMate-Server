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
exports.showSubCategory = exports.createSubCategory = exports.searchBudget = exports.getGroupMemberSpending = exports.deleteBudget = exports.updateBudget = exports.showBudget = exports.createBudget = exports.changeSubCategIdToName = exports.changeCategIdToName = exports.findUserColorByUserId = exports.findSubCategIdByName = exports.findCategIdByName = exports.findGroupById = exports.findUserById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//import { checkForbiddenGroup } from './Group/GroupService'
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
const changeCategIdToName = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
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
        //await checkForbiddenGroup(user.groupId, groupId)
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
            id: event.id,
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
        let BudgetsToShow = [];
        yield Promise.all(Budgets.map((budget) => __awaiter(void 0, void 0, void 0, function* () {
            let resCategory = yield changeCategIdToName(budget.categoryId);
            let resSubCategory = yield changeSubCategIdToName(budget.subCategoryId);
            let resUserColor = yield findUserColorByUserId(budget.userId);
            let resUserName = yield (0, UserService_1.getUserNameByUserId)(budget.userId);
            BudgetsToShow.push({
                id: budget.id,
                spendingName: budget.spendingName,
                spendings: budget.spendings,
                category: resCategory,
                subCategory: resSubCategory,
                userColor: resUserColor,
                userName: resUserName,
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
                categoryId: yield findCategIdByName(BudgetUpdateRequestDto.category),
                subCategoryId: yield findSubCategIdByName(BudgetUpdateRequestDto.subCategory),
            },
        });
        //return updatedBudget;
        const UserName = yield (0, UserService_1.getUserNameByUserId)(updatedBudget.userId);
        const UserColor = yield findUserColorByUserId(updatedBudget.userId);
        const resCategory = yield changeCategIdToName(updatedBudget.categoryId);
        const resSubCategory = yield changeSubCategIdToName(updatedBudget.subCategoryId);
        const budgetToReturn = {
            userColor: UserColor,
            userName: UserName,
            createdAt: updatedBudget.createdAt,
            spendings: updatedBudget.spendings,
            spendingName: updatedBudget.spendingName,
            id: updatedBudget.id,
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
            let resCategory = yield changeCategIdToName(budget.categoryId);
            let resSubCategory = yield changeSubCategIdToName(budget.subCategoryId);
            let resUserColor = yield findUserColorByUserId(budget.userId);
            let resUserName = yield (0, UserService_1.getUserNameByUserId)(budget.userId);
            BudgetsToShow.push({
                id: budget.id,
                spendingName: budget.spendingName,
                spendings: budget.spendings,
                category: resCategory,
                subCategory: resSubCategory,
                userColor: resUserColor,
                userName: resUserName,
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
//카테고리 보여주기 -> 만들 필요 있나??
//서브카테고리 보여주기
const showSubCategory = (groupId, categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = yield findCategIdByName(categoryName);
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
        console.log('각 지출액 - 그룹 평균 지출액:', groupMemberSpendings);
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
    console.log('내림차순 정렬 후 처음pos: ', Positives);
    console.log('내림차순 정렬 후 처음neg: ', Negatives);
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
            // else if(Math.abs(Positives[0].userSpending) == Math.abs(Negatives[0].userSpending)){
            //   sendToAdjustments(groupId, Negatives[0].userId, Positives[0].userId, Positives[0].userSpending);
            //   Negatives[0].userSpending = NaN;
            //   Positives[0].userSpending = NaN;
            // }
            Positives = Positives.filter((obj) => !isNaN(obj.userSpending));
            Negatives = Negatives.filter((obj) => !isNaN(obj.userSpending));
            Positives = Positives.sort((a, b) => b.userSpending - a.userSpending);
            Negatives = Negatives.sort((a, b) => b.userSpending - a.userSpending);
            console.log('whilepos', Positives);
            console.log('whileneg', Negatives);
        }
    }
    return 0;
});
const sendToAdjustments = (groupId, fromId, toId, change) => __awaiter(void 0, void 0, void 0, function* () {
    //const Adjustment =
    yield prisma.adjustment.create({
        data: {
            groupId: groupId,
            plusUserId: toId,
            minusUserId: fromId,
            change: change,
        },
    });
});
getAdjustmentsCalc('aaaaab');
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
    return Adjustment;
});
//userId 별로 보여줘야 함
//adjustment 지우기 -> 정산 완료 눌렀을 때 사용할 것..
const deleteAdjustment = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const AdjustmentDeletion = yield prisma.adjustment.deleteMany({
        where: {
            groupId: groupId,
        },
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
const getAdjustments = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const AdjustedResult = yield takeFromAdjustments(groupId);
    const LastCalculatedDate = yield getDayReturn(groupId);
    return { LastCalculatedDate, AdjustedResult };
});
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
//   const UserName = await getUserNameByUserId(newBudget.userId);
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
//# sourceMappingURL=BudgetService.js.map