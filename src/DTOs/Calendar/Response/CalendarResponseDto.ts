export interface CalendarResponseDto {
  calendarId: number;
  dutyName: string;
  userId: string;  
  groupId: string;
  dateStart: string;
  dateEnd: string;
  routine: number
  memo?: string
}