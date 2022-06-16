import { Router } from 'express'
import { ICradle } from '../container'

export const chatRouter = ({ middlwares, controllers }: ICradle) => {
  const routers = Router()
  const { verifyAccessToken } = middlwares.verifyTokenMiddleware
  const { chatController } = controllers

  routers.post('/create', verifyAccessToken, chatController.createNewChat)

  routers.get('/get', verifyAccessToken, chatController.getListChats)

  routers.delete('/delete', verifyAccessToken, chatController.deleteChat)

  routers.patch('/read', verifyAccessToken, chatController.updateReaded)

  routers.patch('/nickname', verifyAccessToken, chatController.updateNickname)

  routers.patch('/color', verifyAccessToken, chatController.updateColor)

  routers.patch('/emoji', verifyAccessToken, chatController.updateEmoji)

  routers.patch(
    '/background_color',
    verifyAccessToken,
    chatController.updateBackgroundColor,
  )

  return routers
}
