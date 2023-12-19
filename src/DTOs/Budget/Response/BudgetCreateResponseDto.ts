import { BudgetCreateRequestDto } from "../Request/BudgetCreateRequestDto";

export interface BudgetCreateResponseDto extends BudgetCreateRequestDto{
    userColor: string;
}