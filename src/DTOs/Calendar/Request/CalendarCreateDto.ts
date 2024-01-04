export interface CalendarCreateDto {
  calendarId: number;
  title: string;
  userId: string;  
  groupId: string;
  dateStart: string;
  dateEnd: string;
  term: number
  memo?: string
}
