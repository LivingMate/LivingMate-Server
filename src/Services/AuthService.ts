import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import errorGenerator from '../../error/errorGenerator'
import message from '../modules/message'
import statusCode from '../modules/statusCode'
import { LoginDto } from '../DTOs/Auth/Requests/LoginDto'
import { getToken, getRefreshToken } from '../Middleware/jwtHandler'
import { signInKakao } from '../Middleware/socialAuth'
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto'
import * as UserService from '../Services/User/UserService'
import * as UserServiceUtils from '../Services/User/UserServiceUtils'

const prisma = new PrismaClient()

const login = async (loginDto: LoginDto) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    })

    if (!user)
      throw errorGenerator({
        msg: message.NOT_FOUND_USER_EMAIL,
        statusCode: statusCode.NOT_FOUND,
      })

    const isMatch = await bcrypt.compare(loginDto.password, user.password)
    if (!isMatch)
      throw errorGenerator({
        msg: message.INVALID_PASSWORD,
        statusCode: statusCode.UNAUTHORIZED,
      })

    const data = {
      userId: user.id,
    }

    return data
  } catch (error) {
    throw error
  }
}

//* 소셜 로그인
const socialLogin = async (socialToken: string, socialPlatform: string) => {
  const userC = await UserServiceUtils.createColor()
  const Id = await UserServiceUtils.createUserId()
  const defaultGroupId = 'aaaaaa'
  let platform = ''
  let email
  let name

  switch (socialPlatform) {
    case 'kakao':
      const userKakaoData = await signInKakao(socialToken)
      name = userKakaoData.profile_nickname
      email = userKakaoData.account_email //kakao_account.email
      platform = socialPlatform
      break
  }

  if (email === undefined || email === null) return message.NULL_VALUE

  //* 기존 회원인지 확인
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  })

  //미등록 유저
  if (!existingUser) {
    const refreshToken = getRefreshToken()

    const createUser = await prisma.user.create({
      data: {
        id: Id,
        userName: name,
        userColor: userC,
        groupId: defaultGroupId,
        email: email,
        refreshToken: refreshToken,
        password: platform,
      },
    })
    const accessToken = getToken(createUser.id)

    return {
      accessToken,
    }
  }

  //* 기존에 회원이 등록되어있으면, 자동 로그인
  const accessToken = getToken(existingUser.id)
  const refreshToken = getRefreshToken()

  await prisma.user.update({
    data: {
      refreshToken: refreshToken,
    },
    where: {
      email: email,
    },
  })

  return {
    accessToken,
    refreshToken,
    isSignedUp: true,
  }
}

export { login, socialLogin }
