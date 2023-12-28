export interface BudgetCreateRequestDto{
    id:number;
    spendings: number;
    spendingName: string;
    category: string;
    subCategory: string;
    userName: string;
}
