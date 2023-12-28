
import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import * as BudgetService from '../Services/BudgetService'
import { BudgetCreateRequestDto} from '../DTOs/Budget/Request/BudgetCreateRequestDto';



/*
get
/:groupId
/budget
*/ 

const showBudget = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const groupId: string = req.params.groupId; 
  
    try {
      const data = await BudgetService.showBudget(groupId);
  
      return res
        .send(data);
    } catch (error) {
      res.status(500).json({ error: 'Error Fetching Budget Data: Controller' });
    }
};



/*
  get
  /:groupId
  /budget
  서치
*/

const getBudgetSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise<void | Response> => {
    const groupId: string = req.params.groupId; 
    const searchKey: string = req.body.searchKey;
    
    try {
      const data = await BudgetService.searchBudget(groupId,searchKey);
      
      return res
      .send(data);
    }catch (error) {
      res.status(500).json({ error: 'Error Searching Budget: Controller' });
  }
}




// /*
// get
// 정산
// */


/*
post
/budget
*/
   const createBudget = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const groupId: string = req.params.groupId; 
    const userId: string = req.params.userId;
    const BudgetCreateRequestDto: BudgetCreateRequestDto =  req.body;
  
    try {
      const data = await BudgetService.createBudget(userId, groupId, BudgetCreateRequestDto);
  
      return res
        .send(data);
    } catch (error) {
      res.status(500).json({ error: 'Error Creating Budget: Controller' });
    }

};

/*
delete
/feed
*/

const deleteBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const budgetId = req.body.data;
  try{
    await BudgetService.deleteBudget(budgetId);
    res.status(200).send();
  }catch(error){
    res.status(500).json({ error: 'Error Deleting Budget: Controller' });
  }
}


// /*
// updateBudget
// /budget/:budgetId
// */
const updateBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const IntbudgetId = req.params.budgetId;
  const budgetId = parseInt(IntbudgetId);
  const BudgetUpdateRequestDto = req.body.data
  
  try{
    await BudgetService.updateBudget(budgetId, BudgetUpdateRequestDto);
    res.status(200).send();
  }catch(error){
    res.status(500).json({ error: 'Error Updating Budget Content: Controller' });
  }
}


/*
updateNewCategory
/budget
*/
// const updateBudgetCategory = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void | Response> => {
//   const groupId = req.params.groupId;
//   const subCategoryName = req.body.data
  
//   try{
//     await BudgetService.updateNewSubCategory(groupId, subCategoryName);
//     res.status(200).send();
//   }catch(error){
//     res.status(500).json({ error: 'Error Updating Budget Content: Controller' });
//   }
// }

export{
  //updateBudgetCategory,
  updateBudget,
  deleteBudget,
  createBudget,
  getBudgetSearch,
  showBudget
}