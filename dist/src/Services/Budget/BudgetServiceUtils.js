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
exports.changeSubCategIdToName = exports.changeCategIdToName = exports.findSubCategIdByName = exports.findCategIdByName = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const message_1 = __importDefault(require("../../modules/message"));
// ------------utils-------------
// 카테고리 이름으로 아이디 찾기
const findCategIdByName = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    // userId가 정의되어 있지 않거나 문자열이 아닌 경우 에러 발생
    if (!categoryName || typeof categoryName !== 'string') {
        throw new Error('Invalid categoryName');
    }
    const data = yield prisma.category.findUnique({
        where: {
            name: categoryName,
        }
    });
    if (!data) {
        throw new Error(message_1.default.UNAUTHORIZED);
    }
    return data.id;
});
exports.findCategIdByName = findCategIdByName;
// 섭카테고리 이름으로 섭카테고리 id 찾기
function findSubCategIdByName(subCategoryName, groupId, categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subCategory = yield prisma.subCategory.findMany({
                where: {
                    name: subCategoryName,
                    groupId: groupId,
                    categoryId: categoryId
                },
            });
            let subcategories = [];
            subCategory.forEach((subcategory) => {
                if (!subcategory) {
                    throw new Error("등록되지 않은 subCategory입니다.");
                }
                else {
                    subcategories.push(subcategory.id);
                }
            });
            return subcategories[0];
        }
        catch (error) {
            console.error('Error in findSubCategIdByName:', error);
            throw error;
        }
    });
}
exports.findSubCategIdByName = findSubCategIdByName;
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
//# sourceMappingURL=BudgetServiceUtils.js.map