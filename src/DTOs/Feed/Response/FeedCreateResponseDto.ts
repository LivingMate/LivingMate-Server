import { FeedCreateRequestDto } from '../Request/FeedCreateRequestDto'

export interface FeedCreateResponseDto extends FeedCreateRequestDto {
    feedId: number,
    userId: string,
    groupId: string,
    userName : string,
    userColor : string,
    createdAt : Date,
    pinned: boolean
}
