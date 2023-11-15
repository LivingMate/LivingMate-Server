//이걸 어떻게 만들면 좋을까요..............................
// 각 유저 아이디에 따라서 계산된 만큼을 매핑해줘야 함.
// 이걸 여러개 만들어서 사용해야 하나?
export interface BudegetAdjustResponseDTO{
    userId: string;
    userAdjust: number;
}
