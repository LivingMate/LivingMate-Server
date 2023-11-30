import { CalendarBaseDto } from "../CalendarBaseDto32";

export interface CalendarRightCreateDto extends CalendarBaseDto {
  routine: number
  memo?: string
}
