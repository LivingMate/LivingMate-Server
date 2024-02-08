import express from 'express'
import * as BudgetController from '../Controllers/BudgetController'
import auth from '../Middleware/auth';

const BudgetRouter = express.Router();


BudgetRouter.get('/budget', auth,  BudgetController.showBudget);
BudgetRouter.get('/budget/search/:searchKey',auth, BudgetController.getBudgetSearch); 
BudgetRouter.get('/budget/sub/:categoryName', auth, BudgetController.showSubCategories);
BudgetRouter.get('/budget/calc', auth, BudgetController.getFinalAdjustment);
BudgetRouter.get('/budget/calcbudget', auth,  BudgetController.getAdjforBudget);
BudgetRouter.get('/budget/category/search/:category', auth, BudgetController.getBudgetSearchByCategory);

BudgetRouter.post('/budget', auth, BudgetController.createBudget);
BudgetRouter.post('/budget/subcat/:categoryId', auth,  BudgetController.createsubCategory);

BudgetRouter.patch('/budget/:budgetId', auth, BudgetController.updateBudget);
BudgetRouter.patch('/budget/done', auth,  BudgetController.doneBudget);

BudgetRouter.delete('/budget/:budgetId', auth, BudgetController.deleteBudget);


export {BudgetRouter};
