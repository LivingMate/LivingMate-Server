import { FeedUpdateDto } from '../Request/FeedUpdateDto'

export interface FeedUpdateResponseDto extends FeedUpdateDto {
    userName : string,
    userColor : string
}
