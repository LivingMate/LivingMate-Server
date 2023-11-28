import { CalendarBaseDTO } from "../CalendarBaseDTO";

export interface ScheduleCreateDto extends CalendarBaseDTO{
  userId: string;
}
