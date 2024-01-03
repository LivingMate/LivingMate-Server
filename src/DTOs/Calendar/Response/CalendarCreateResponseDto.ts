import { CalendarCreateDto } from '../Request/CalendarCreateDto'

export interface CalendarCreateResponseDto extends CalendarCreateDto{
    userName: string,
    userColor: string,
}
