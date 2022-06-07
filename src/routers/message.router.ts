import { Router } from 'express'
import { ICradle } from '../container'

export const messageRouter = ({ middlwares, controllers }: ICradle) => {
  const routers = Router()
  const { verifyAccessToken } = middlwares.verifyTokenMiddleware
  const { messageController } = controllers

  routers.post('/send', verifyAccessToken, messageController.sendMessage)

  routers.get('/:chat_id', verifyAccessToken, messageController.getListMessages)

  return routers
}
