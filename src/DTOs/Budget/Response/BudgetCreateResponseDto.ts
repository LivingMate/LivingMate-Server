import { BudgetCreateRequestDto } from "../Request/BudgetCreateRequestDto";

export interface BudgetCreateResponseDto extends BudgetCreateRequestDto{
    budgetId: number;
    category: string;
    subCategory: string;
    userColor: string;
}