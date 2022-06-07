import { Router } from 'express'
import { ICradle } from '../container'
import { chatRouter } from './chat.router'
import { messageRouter } from './message.router'
import { userRouter } from './user.router'

export const routers = (iCradle: ICradle) => {
  const routers = Router()

  routers.use('/user', userRouter(iCradle))

  routers.use('/chat', chatRouter(iCradle))

  routers.use('/message', messageRouter(iCradle))

  return routers
}
