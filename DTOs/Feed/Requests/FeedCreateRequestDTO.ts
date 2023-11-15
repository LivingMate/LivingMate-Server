import { FeedBaseDTO } from '../FeedBaseDTO';
export interface FeedCreateRequestDTO extends FeedBaseDTO{
    createdAt: Date;
}