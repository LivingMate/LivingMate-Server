export interface BudgetBaseDTO{
    userid: string;
    budgetid: number; //가계부 인덱스
    spending: number; //지출금액
    category: string;
}