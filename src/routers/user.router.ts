import { Router } from 'express'
import { ICradle } from '../container'

export const userRouter = ({ middlwares, controllers }: ICradle) => {
  const routers = Router()
  const { validateMiddlewares, verifyTokenMiddleware } = middlwares
  const { userController } = controllers

  routers.post(
    '/register',
    validateMiddlewares.validateRegisterInput,
    userController.registerNewUser,
  )

  routers.post(
    '/login',
    validateMiddlewares.validateLoginInput,
    userController.loginAccountUser,
  )

  routers.patch(
    '/logout',
    verifyTokenMiddleware.verifyAccessToken,
    userController.logoutAccountUser,
  )

  routers.patch(
    '/avatar',
    verifyTokenMiddleware.verifyAccessToken,
    userController.changeAvatar,
  )

  routers.get(
    '/me',
    verifyTokenMiddleware.verifyAccessToken,
    userController.getMyInfo,
  )

  routers.get(
    '/search',
    verifyTokenMiddleware.verifyAccessToken,
    userController.searchUsers,
  )

  return routers
}
