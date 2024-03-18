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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRouter = void 0;
const express_1 = __importDefault(require("express"));
const BudgetController = __importStar(require("../Controllers/BudgetController"));
const auth_1 = __importDefault(require("../Middleware/auth"));
const BudgetRouter = express_1.default.Router();
exports.BudgetRouter = BudgetRouter;
BudgetRouter.get('/budget', auth_1.default, BudgetController.showBudget);
BudgetRouter.get('/budget/search/:searchKey', auth_1.default, BudgetController.getBudgetSearch);
BudgetRouter.get('/budget/subcat/:categoryName', auth_1.default, BudgetController.showSubCategories);
BudgetRouter.get('/budget/calc', auth_1.default, BudgetController.getAdjCalc);
BudgetRouter.get('/budget/calcbudget', auth_1.default, BudgetController.getAdjforBudget);
BudgetRouter.get('/budget/category/search/:category', auth_1.default, BudgetController.getBudgetSearchByCategory);
BudgetRouter.get('/budget/:budgetId', auth_1.default, BudgetController.getBudget);
BudgetRouter.get('/budget/calc/adjnoti', auth_1.default, BudgetController.getAdjNoti);
BudgetRouter.get('/budget/calc/isCalculating', auth_1.default, BudgetController.isCalculating);
BudgetRouter.post('/budget', auth_1.default, BudgetController.createBudget);
BudgetRouter.post('/budget/subcat/:categoryName', auth_1.default, BudgetController.createsubCategory);
BudgetRouter.patch('/budget/update/:budgetId', auth_1.default, BudgetController.updateBudget);
BudgetRouter.patch('/budget/done', auth_1.default, BudgetController.doneBudget);
BudgetRouter.delete('/budget/:budgetId', auth_1.default, BudgetController.deleteBudget);
BudgetRouter.delete('/budget/subcat/:categoryName/:subCategoryName', auth_1.default, BudgetController.deleteSubCategory);
//# sourceMappingURL=BudgetRouter.js.map