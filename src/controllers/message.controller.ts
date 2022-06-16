import { Response } from 'express'
import { ICreateMessageDto } from '../interfaces'
import { ICradle } from '../container'

export const messageController = ({ helpers, services, cache }: ICradle) => {
  const { responseHelper } = helpers
  const { chatService, messageService } = services

  const sendMessage = async (req: any, res: Response) => {
    const content = req.body.content.trim()
    const type = req.body.type.trim()
    const chatId = req.body.chat_id.trim()
    const guestId = req.body.guest_id.trim()
    let guestChatId = req.body.guest_chat_id?.trim() || null
    const nicknameHost = req.body.nickname_host?.trim() || null
    const nicknameGuest = req.body.nickname_guest?.trim() || null
    const color = req.body.color
    const emoji = req.body.emoji
    const backgroundColor = req.body.background_color
    if (
      !content ||
      !['text', 'icon', 'image', 'voice', 'video', 'config'].includes(type) ||
      !chatId ||
      !guestId
    )
      return responseHelper.badRequest(res, 'Invalid data!')
    if (guestId === req.userId)
      return responseHelper.badRequest(res, 'Cannot send message!')
    try {
      let newGuestChat = null
      if (guestChatId === null) {
        newGuestChat = await chatService.createOne({
          host_id: guestId,
          guest_id: req.userId,
          guest_chat_id: chatId,
          readed: true,
          nickname_host: nicknameGuest,
          nickname_guest: nicknameHost,
          color,
          background_color: backgroundColor,
          emoji,
        })
        guestChatId = newGuestChat.id
        await chatService.updateOneGuestChatId(newGuestChat.id, chatId)
      }
      const createNewMessage = (chat_id: string): ICreateMessageDto => ({
        content,
        type,
        sender_id: req.userId,
        receiver_id: guestId,
        chat_id,
      })
      const newMessage = await messageService.createOne(
        createNewMessage(chatId),
      )
      const newGuestMessage = await messageService.createOne(
        createNewMessage(guestChatId),
      )
      await chatService.updateOneReaded(guestChatId, false)
      await cache.delCache(`list messages of chat: ${chatId}`)
      await cache.delCache(`list messages of chat: ${guestChatId}`)
      await cache.delCache(`list chats of user: ${req.userId}`)
      await cache.delCache(`list chats of user: ${guestId}`)
      newGuestChat =
        newGuestChat && (await chatService.findOneById(newGuestChat.id))
      return responseHelper.responseSuccess(res, 'Send message successfully', {
        new_message: newMessage,
        new_guest_message: newGuestMessage,
        new_guest_chat: newGuestChat,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const getListMessages = async (req: any, res: Response) => {
    const chatId = req.params.chat_id?.trim() || null
    try {
      let listMessages = await cache.getCache(
        `list messages of chat: ${chatId}`,
      )
      if (listMessages === null) {
        listMessages = await messageService.findByChatId(chatId)
        await cache.setCache(`list messages of chat: ${chatId}`, listMessages)
      }
      return responseHelper.responseSuccess(
        res,
        'Get list messages successfully',
        { list_messages: listMessages },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  return {
    sendMessage,
    getListMessages,
  }
}
