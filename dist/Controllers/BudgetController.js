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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../Services/index");
/*
get
/:groupId
/budget
*/
const showBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.body.group.id;
    try {
        const data = yield index_1.BudgetService.showBudget(groupId);
        return res
            .send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Fetching Budget Data: Controller' });
    }
});
/*
  get
  /:groupId
  /budget
  서치
*/
const getBudgetSearch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.body.group.id;
    const searchKey = req.body.data;
    try {
        const data = yield index_1.BudgetService.searchBudget(groupId, searchKey);
        return res
            .send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Searching Budget: Controller' });
    }
});
/*
get
정산
*/
/*
post
/budget
*/
const createBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.body.group.id;
    const BudgetBaseDTO = req.body.data;
    try {
        const data = yield index_1.BudgetService.createBudget(BudgetBaseDTO, groupId);
        return res
            .send(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Creating Budget: Controller' });
    }
});
/*
delete
/feed
*/
const deleteBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const budgetId = req.body.data;
    try {
        yield index_1.BudgetService.deleteBudget(budgetId);
        res.status(200).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error Deleting Budget: Controller' });
    }
});
/*
updateBudget
/budget/:budgetId
*/
const updateBudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const budgetId = req.body.id;
    const BudgetUpdateRequestDto = req.body.data;
    try {
        yield index_1.BudgetService.updateBudgetContent(budgetId, BudgetUpdateRequestDto);
        res.status(200).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error Updating Budget Content: Controller' });
    }
});
/*
updateNewCategory
/budget
*/
const updateBudgetCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.body.id;
    const subCategoryName = req.body.data;
    try {
        yield index_1.BudgetService.updateNewSubCategory(groupId, subCategoryName);
        res.status(200).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error Updating Budget Content: Controller' });
    }
});
//# sourceMappingURL=BudgetController.js.map