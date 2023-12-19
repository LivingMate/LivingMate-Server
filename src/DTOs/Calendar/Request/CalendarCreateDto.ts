export interface CalendarCreateDto {
  calendarId: number;
  dutyName: string;
  userId: string;  
  groupId: string;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  routine: number
  memo?: string
}
