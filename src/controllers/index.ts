import { ICradle } from '../container'
import { chatController } from './chat.controller'
import { messageController } from './message.controller'
import { userController } from './user.controller'

export const controllers = (iCradle: ICradle) => ({
  userController: userController(iCradle),
  chatController: chatController(iCradle),
  messageController: messageController(iCradle),
})
