import { CalendarCreateDto } from '../Request/CalendarCreateDto'
import { SchedulingCreateDto } from '../Request/SchedulingCreateDto'

export interface CalendarCreateResponseDto extends CalendarCreateDto, SchedulingCreateDto{}
