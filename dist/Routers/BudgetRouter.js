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
const BudgetRouter = express_1.default.Router();
exports.BudgetRouter = BudgetRouter;
BudgetRouter.get('/budget/:groupId', BudgetController.showBudget);
BudgetRouter.get('/budget/:groupId', BudgetController.getBudgetSearch); //이렇게 path 겹치면 오버라이드 된다는 말이 있음.. 
BudgetRouter.post('/budget', BudgetController.createBudget);
BudgetRouter.patch('/budget/:budgetId', BudgetController.updateBudget);
BudgetRouter.patch('/budget/:groupId', BudgetController.updateBudgetCategory);
BudgetRouter.delete('/budget/:budgetId', BudgetController.deleteBudget);
//# sourceMappingURL=BudgetRouter.js.map