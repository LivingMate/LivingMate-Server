export interface FeedCreateDto{
    feedId : number,
    userId : string,
    groupId : string,
    text : string,
    date : Date,
    pin : boolean,
}