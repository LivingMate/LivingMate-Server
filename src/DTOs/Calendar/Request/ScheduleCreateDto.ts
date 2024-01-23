export interface ScheduleCreateDto {
  scheduleId: number
  groupId: string
  title: string
  dates: string[]
  startTime: string
  endTime: string
}
