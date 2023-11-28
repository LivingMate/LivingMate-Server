import { CalendarBaseDTO } from '../CalendarBaseDTO'

export interface CalendarRightCreateDTO extends CalendarBaseDTO {
  userId: string;
  routine: number;
  memo: string;
}
