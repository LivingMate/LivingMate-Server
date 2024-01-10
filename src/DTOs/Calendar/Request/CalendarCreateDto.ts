export interface CalendarCreateDto {
  Id: number;
  title: string;
  userId: string;  
  groupId: string;
  dateStart: string;
  dateEnd: string;
  term: number;
  memo?: string;
  participants: string[],
}
