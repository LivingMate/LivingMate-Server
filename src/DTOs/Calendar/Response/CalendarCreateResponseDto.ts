export interface ParticipantInfo {
  userId: string
  userColor: string
  userName: string
}
export interface CalendarCreateResponseDto {
  Id: number
  title: string
  userId: string
  groupId: string
  dateStart: string
  dateEnd: string
  term: number
  memo?: string
  participants: ParticipantInfo[]
}
