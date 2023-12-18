import express from 'express'
import * as BudgetController from '../Controllers/BudgetController'


const BudgetRouter = express.Router();


BudgetRouter.get('/budget/:groupId', BudgetController.showBudget);
BudgetRouter.get('/budget/:groupId', BudgetController.getBudgetSearch); //이렇게 path 겹치면 오버라이드 된다는 말이 있음.. 
BudgetRouter.post('/budget', BudgetController.createBudget);
BudgetRouter.patch('/budget/:budgetId', BudgetController.updateBudget);
BudgetRouter.patch('/budget/:groupId', BudgetController.updateBudgetCategory);
BudgetRouter.delete('/budget/:budgetId', BudgetController.deleteBudget);


export {BudgetRouter};
