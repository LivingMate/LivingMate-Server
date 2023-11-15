import { CalendarBaseDTO } from '../CalendarBaseDTO';
export interface CalendarDirectPostRequestDTO extends CalendarBaseDTO{
    scheduleStartAt: Date;
    scheduleEndAt: Date;
    //Routine?
    memo : string;
}