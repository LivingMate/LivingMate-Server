import { BudgetBaseDto} from '../BudgetBaseDto';

export interface BudgetUpdateRequestDto extends BudgetBaseDto{
    budgetId: number;
}

