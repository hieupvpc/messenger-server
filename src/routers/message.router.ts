import { Router } from 'express'
import { ICradle } from '../container'

export const messageRouter = ({ middlwares, controllers }: ICradle) => {
  const routers = Router()
  const { verifyAccessToken } = middlwares.verifyTokenMiddleware
  const { messageController } = controllers

  routers.post('/send', verifyAccessToken, messageController.sendMessage)

  routers.get('/get', verifyAccessToken, messageController.getListMessages)

  return routers
}
