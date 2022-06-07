import { Router } from 'express'
import { ICradle } from '../container'

export const chatRouter = ({ middlwares, controllers }: ICradle) => {
  const routers = Router()
  const { verifyAccessToken } = middlwares.verifyTokenMiddleware
  const { chatController } = controllers

  routers.post('/create', verifyAccessToken, chatController.createNewChat)

  routers.get('/get', verifyAccessToken, chatController.getListChats)

  routers.delete('/delete', verifyAccessToken, chatController.deleteChat)

  return routers
}
