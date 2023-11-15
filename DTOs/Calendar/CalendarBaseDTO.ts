export interface CalendarBaseDTO{
    calendarId: number;
    dutyName: string;
    userId: string;  //이걸 배열로 받아야 할 지도 모르겠어.. 선택하는 부분이 하나라서. 배열로 받고 그걸 각 레코드별로 나눠서 저장할 수 있나?
}