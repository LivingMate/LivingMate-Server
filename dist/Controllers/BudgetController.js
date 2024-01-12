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
exports.getAdjforBudget = exports.getFinalAdjustment = exports.showSubCategories = exports.showBudget = exports.getBudgetSearch = exports.createBudget = exports.deleteBudget = exports.updateBudget = exports.createsubCategory = void 0;
const BudgetService = __importStar(require("../Services/Budget/BudgetService"));
/*
get
/:groupId
/budget
*/
const showBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const groupId: string = req.params.groupId;
    const groupId = req.params.groupId; //작동 안 하면 이거때문임. { } 이거 고쳤음. params 이거랑
    try {
        const data = yield BudgetService.showBudget(groupId);
        return res.send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Fetching Budget Data: Controller' });
    }
});
exports.showBudget = showBudget;
/*
  get
  /:groupId
  /budget
  서치
*/
const getBudgetSearch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    const searchKey = req.params.searchKey;
    try {
        const data = yield BudgetService.searchBudget(groupId, searchKey);
        return res.send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Searching Budget: Controller' });
    }
});
exports.getBudgetSearch = getBudgetSearch;
// /*
// get
// 정산
// */
const getFinalAdjustment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    try {
        const data = yield BudgetService.finalAdjustment(groupId);
        return res.send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting FinalAdjustment: Controller' });
    }
});
exports.getFinalAdjustment = getFinalAdjustment;
const getAdjforBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    try {
        const data = yield BudgetService.AdjAtBudget(groupId);
        return res.send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting AdjforBudget: Controller' });
    }
});
exports.getAdjforBudget = getAdjforBudget;
/*
post
/budget
*/
const createBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    const userId = req.params.userId;
    const BudgetCreateRequestDto = req.body;
    try {
        const data = yield BudgetService.createBudget(userId, groupId, BudgetCreateRequestDto);
        return res.send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Creating Budget: Controller' });
    }
});
exports.createBudget = createBudget;
/*
delete
/budget
*/
const deleteBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const StrbudgetId = req.params.budgetId;
    const budgetId = parseInt(StrbudgetId);
    try {
        yield BudgetService.deleteBudget(budgetId);
        res.status(200).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error Deleting Budget: Controller' });
    }
});
exports.deleteBudget = deleteBudget;
/*
updateBudget
/budget/:budgetId
*/
const updateBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const StrbudgetId = req.params.budgetId;
    const budgetId = parseInt(StrbudgetId);
    const BudgetUpdateRequestDto = req.body;
    try {
        const data = yield BudgetService.updateBudget(budgetId, BudgetUpdateRequestDto);
        res.status(200).send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Updating Budget Content: Controller' });
    }
});
exports.updateBudget = updateBudget;
/*
createNewSubCategory
/budget
*/
const createsubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    const subCategoryName = req.body.name;
    const StrcategoryId = req.params.categoryId;
    const categoryId = parseInt(StrcategoryId);
    try {
        const data = yield BudgetService.createSubCategory(groupId, categoryId, subCategoryName);
        res.status(200).send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Updating Budget Content: Controller' });
    }
});
exports.createsubCategory = createsubCategory;
/*
showSubCategory
*/
const showSubCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    const categoryName = req.params.categoryName;
    try {
        const data = yield BudgetService.showSubCategory(groupId, categoryName);
        return res.send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Fetching SubCategory Data: Controller' });
    }
});
exports.showSubCategories = showSubCategories;
//# sourceMappingURL=BudgetController.js.map