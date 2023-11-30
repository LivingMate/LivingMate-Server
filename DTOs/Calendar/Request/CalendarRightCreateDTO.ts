import { CalendarBaseDto } from "../CalendarBaseDto";

export interface CalendarRightCreateDto extends CalendarBaseDto {
  routine: number
  memo?: string
}
