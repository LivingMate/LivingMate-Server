import { FeedBaseDTO } from '../FeedBaseDTO';

export interface FeedUpdateRequestDTO extends FeedBaseDTO{
    updatedAt: Date;
}
