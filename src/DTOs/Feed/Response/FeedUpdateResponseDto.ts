import { FeedUpdateRequestDto } from '../Request/FeedUpdateRequestDto'

export interface FeedUpdateResponseDto extends FeedUpdateRequestDto {
  feedId: number
  groupId: string
  userId: string
  userName : string,
  userColor : string,
  createdAt: Date
  pinned: boolean
}
