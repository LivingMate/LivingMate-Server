export interface NotificationRequestDto{
    groupId: string;
    userId: string;
    text: string;
    createdAt: Date;
    isDelete: boolean;
}