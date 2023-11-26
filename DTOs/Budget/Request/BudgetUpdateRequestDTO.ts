import { BudgetBaseDTO } from '../BudgetBaseDTO';

export interface BudgetUpdateRequestDTO extends BudgetBaseDTO{
    budgetId: number;
}

