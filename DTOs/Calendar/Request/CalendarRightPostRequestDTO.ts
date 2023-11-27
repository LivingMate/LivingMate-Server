import { CalendarBaseDTO } from '../CalendarBaseDTO'
export interface CalendarRightPostRequestDTO extends CalendarBaseDTO {
  userId: string;
  routine: number;
  memo: string;
}
