import { FeedCreateDto } from '../Request/FeedCreateDto'

export interface FeedCreateResponseDto extends FeedCreateDto {
    userName : string,
    userColor : string,
}
