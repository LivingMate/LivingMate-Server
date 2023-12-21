export interface BudgetCreateRequestDto{
    spendings: number;
    spendingName: string;
    category: number;
    subCategory: number;
    createdAt: Date;
}
