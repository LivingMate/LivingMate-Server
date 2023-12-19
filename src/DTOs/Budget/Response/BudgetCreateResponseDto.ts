import { BudgetCreateRequestDto } from "../Request/BudgetCreateRequestDto";

export interface BudgetCreateResponseDto extends BudgetCreateRequestDto{
    calendarId: number;
    userColor: string;
}