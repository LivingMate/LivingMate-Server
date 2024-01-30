export interface ParticipantInfo {
    userId: string
    userColor: string
    userName: string
  }
export interface SchedulingCreateResponseDto {
    schedulingId: number,
    groupId: string,
    scheduleId: number,
    date: string,
    time: string,
    selectedBy: ParticipantInfo[]
}
