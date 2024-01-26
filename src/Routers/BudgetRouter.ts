import express from 'express'
import * as BudgetController from '../Controllers/BudgetController'


const BudgetRouter = express.Router();


BudgetRouter.get('/budget/:groupId', BudgetController.showBudget);
BudgetRouter.get('/budget/search/:groupId/:searchKey', BudgetController.getBudgetSearch); 
BudgetRouter.get('/budget/sub/:groupId/:categoryName', BudgetController.showSubCategories);
BudgetRouter.get('/budget/calc/:groupId', BudgetController.getFinalAdjustment);
BudgetRouter.get('/budget/calcbudget/:groupId', BudgetController.getAdjforBudget);
BudgetRouter.get('/budget/category/search/:groupId/:category', BudgetController.getBudgetSearchByCategory);

BudgetRouter.post('/budget/:groupId/:userId', BudgetController.createBudget);
BudgetRouter.post('/budget/subcat/:groupId/:categoryId', BudgetController.createsubCategory);

BudgetRouter.patch('/budget/:budgetId', BudgetController.updateBudget);

BudgetRouter.delete('/budget/:budgetId', BudgetController.deleteBudget);


export {BudgetRouter};
