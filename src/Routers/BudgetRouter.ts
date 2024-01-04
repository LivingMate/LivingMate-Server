import express from 'express'
import * as BudgetController from '../Controllers/BudgetController'


const BudgetRouter = express.Router();


BudgetRouter.get('/budget/:groupId', BudgetController.showBudget);
BudgetRouter.get('/budget/search/:groupId/:searchKey', BudgetController.getBudgetSearch); 
BudgetRouter.get('/budget/:groupId/:categoryName', BudgetController.showSubCategories);
BudgetRouter.get('/budget/calc/:groupId', BudgetController.getFinalAdjustment);


BudgetRouter.post('/budget/:groupId/:userId', BudgetController.createBudget);
BudgetRouter.post('/budget/:groupId/:categoryId', BudgetController.createsubCategory);

BudgetRouter.patch('/budget/:budgetId', BudgetController.updateBudget);

BudgetRouter.delete('/budget/:budgetId', BudgetController.deleteBudget);


export {BudgetRouter};
