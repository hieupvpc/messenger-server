import { ICradle } from '../container'
import { validateMiddlewares } from './validate.middleware'
import { verifyTokenMiddleware } from './verifyToken.middleware'

export const middlwares = (iCradle: ICradle) => ({
  validateMiddlewares: validateMiddlewares(iCradle),
  verifyTokenMiddleware: verifyTokenMiddleware(iCradle),
})
