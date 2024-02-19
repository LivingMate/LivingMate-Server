import { BudgetCreateRequestDto } from '../Request/BudgetCreateRequestDto'

export interface BudgetCreateResponseDto extends BudgetCreateRequestDto {
  id: number
  userId: string
  groupId: string
  userColor: string
  userName: string
  createdAt: Date
  isDone : boolean
}
