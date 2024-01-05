import { ScheduleCreateDto } from './ScheduleCreateDto'

export interface SchedulingCreateDto extends ScheduleCreateDto {
    date: string,
    time: string,
}
