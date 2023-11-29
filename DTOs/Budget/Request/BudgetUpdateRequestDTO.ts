import { BudgetBaseDto} from '../BudgetBaseDto';

export interface BudgetUpdateRequestDTO extends BudgetBaseDto{
    budgetId: number;
}

