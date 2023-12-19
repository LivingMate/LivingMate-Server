import { CalendarBaseDto } from "../CalendarBaseDto";

export interface CalendarResponseDto extends CalendarBaseDto{
  calendarId: number;
  dutyName: string;
  userId: string;  
  groupId: string;
  dateStart: Date;
  dateEnd: Date;
  timeStart: string;
  timeEnd: string;
}