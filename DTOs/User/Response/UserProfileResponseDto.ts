// interface groupMember{
//     groupMemberName: string[];
//     groupMemberColor: string[];
// }

export interface UserProfileResponseDto{
    userName: string;
    userColor: string;
    groupName?: string;
    //groupMembers?: groupMember;
    groupMembersNames?:string[];
    groupMembersColors?:string[];
}