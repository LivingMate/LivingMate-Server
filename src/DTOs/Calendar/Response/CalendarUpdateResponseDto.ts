import { CalendarUpdateDto } from '../Request/CalendarUpdateDto'

export interface CalendarUpdateResponseDto extends CalendarUpdateDto{
    userName : string,
    userColor : string,
}
