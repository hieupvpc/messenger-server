import { ICradle } from '../container'
import { chatService } from './chat.service'
import { messageService } from './message.service'
import { userService } from './user.service'

export const services = (iCradle: ICradle) => ({
  userService: userService(iCradle),
  chatService: chatService(iCradle),
  messageService: messageService(iCradle),
})
