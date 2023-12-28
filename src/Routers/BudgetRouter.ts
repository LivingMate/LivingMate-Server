import express from 'express'
import * as BudgetController from '../Controllers/BudgetController'


const BudgetRouter = express.Router();


BudgetRouter.get('/budget/:groupId', BudgetController.showBudget);
BudgetRouter.get('/budget/search/:groupId/:searchKey', BudgetController.getBudgetSearch); 
BudgetRouter.post('/budget', BudgetController.createBudget);
BudgetRouter.patch('/budget/:budgetId', BudgetController.updateBudget);
//BudgetRouter.patch('/budget/:groupId', BudgetController.updateBudgetCategory);
BudgetRouter.delete('/budget/:budgetId', BudgetController.deleteBudget);


export {BudgetRouter};
