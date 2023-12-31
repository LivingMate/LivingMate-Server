import { BudgetCreateRequestDto } from "../Request/BudgetCreateRequestDto";

export interface BudgetCreateResponseDto extends BudgetCreateRequestDto{
    id: number;
    userColor: string;
    userName : string;
    createdAt : Date;
}