import { NextFunction, Request, Response } from 'express'
import { validationResult, Result, ValidationError } from 'express-validator'
import { BudgetService } from '../Services/index'
import { BudgetBaseDto } from '../DTOs/Budget/BudgetBaseDto';


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
    const groupId: string = req.body.group.id; 
  
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
    const groupId: string = req.body.group.id; 
    const searchKey: string = req.body.data;
    
    try {
      const data = await BudgetService.searchBudget(groupId,searchKey);
      
      return res
      .send(data);
    }catch (error) {
      res.status(500).json({ error: 'Error Searching Budget: Controller' });
  }
}




/*
get
정산
*/


/*
post
/budget
*/
   const createBudget = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const groupId: string = req.body.group.id; 
    const BudgetBaseDTO: BudgetBaseDto =  req.body.data;
  
    try {
      const data = await BudgetService.createBudget(BudgetBaseDTO, groupId);
  
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

/*
updateBudget
*/
const updateBudgetContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const budgetId = req.body.id;
  const BudgetUpdateRequestDto = req.body.data
  
  try{
    await BudgetService.updateBudgetContent(budgetId, BudgetUpdateRequestDto);
    res.status(200).send();
  }catch(error){
    res.status(500).json({ error: 'Error Updating Budget Content: Controller' });
  }
}


/*
updateCategory
*/