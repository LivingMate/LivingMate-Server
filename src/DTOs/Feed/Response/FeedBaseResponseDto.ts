import { FeedBaseDto } from '../FeedBaseDto';

export interface FeedBaseResponseDto extends FeedBaseDto {
    createdAt: Date;
    userName: string;
    userColor: string;
    pin: boolean;
}