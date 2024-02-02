export interface SignupDto {
  email: string
  groupId?: string
  userName: string
  sex: string
  age: number
  password: string
  fcmToken?: string
}
