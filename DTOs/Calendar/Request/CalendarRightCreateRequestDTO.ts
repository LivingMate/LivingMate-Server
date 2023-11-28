import { CalendarBaseDTO } from '../CalendarBaseDTO'
export interface CalendarRightCreateRequestDTO extends CalendarBaseDTO {
  userId: string;
  routine: number;
  memo: string;
}
