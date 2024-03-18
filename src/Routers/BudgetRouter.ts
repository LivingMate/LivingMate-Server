import express from 'express'
import * as BudgetController from '../Controllers/BudgetController'
import auth from '../Middleware/auth';

const BudgetRouter = express.Router();


BudgetRouter.get('/budget', auth,  BudgetController.showBudget);
BudgetRouter.get('/budget/search/:searchKey',auth, BudgetController.getBudgetSearch); 
BudgetRouter.get('/budget/subcat/:categoryName', auth, BudgetController.showSubCategories);
BudgetRouter.get('/budget/calc', auth, BudgetController.getAdjCalc);
BudgetRouter.get('/budget/calcbudget', auth,  BudgetController.getAdjforBudget);
BudgetRouter.get('/budget/category/search/:category', auth, BudgetController.getBudgetSearchByCategory);
BudgetRouter.get('/budget/:budgetId',auth, BudgetController.getBudget);
BudgetRouter.get('/budget/calc/adjnoti', auth, BudgetController.getAdjNoti);
BudgetRouter.get('/budget/calc/isCalculating',auth, BudgetController.isCalculating);

BudgetRouter.post('/budget', auth, BudgetController.createBudget);
BudgetRouter.post('/budget/subcat/:categoryName', auth,  BudgetController.createsubCategory);

BudgetRouter.patch('/budget/update/:budgetId', auth, BudgetController.updateBudget);
BudgetRouter.patch('/budget/done', auth,  BudgetController.doneBudget);

BudgetRouter.delete('/budget/:budgetId', auth, BudgetController.deleteBudget);
BudgetRouter.delete('/budget/subcat/:categoryName/:subCategoryName', auth, BudgetController.deleteSubCategory);

export {BudgetRouter};
