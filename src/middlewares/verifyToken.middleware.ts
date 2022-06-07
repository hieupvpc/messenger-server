import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { ICradle } from '../container'

export const verifyTokenMiddleware = ({ helpers, envs }: ICradle) => {
  const { responseHelper } = helpers

  const verifyAccessToken = (
    req: any,
    res: Response,
    next: NextFunction,
  ): any => {
    const accessToken = req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return responseHelper.response(res, 401, false, 'Access token not found!')
    }
    try {
      const decoded: any = verify(accessToken, envs.ACCESS_TOKEN_SECRET)
      req.userId = decoded.userId
      next()
    } catch (error) {
      console.log(error)
      return responseHelper.response(res, 403, false, 'Invalid access token!')
    }
  }

  return {
    verifyAccessToken,
  }
}
