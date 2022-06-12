import { Response } from 'express'
import { ICradle } from '../container'

export const chatController = ({ helpers, services, cache }: ICradle) => {
  const { responseHelper } = helpers
  const { chatService, messageService } = services

  const createNewChat = async (req: any, res: Response) => {
    const guestId = req.body.guest_id.trim()
    if (guestId === req.userId)
      return responseHelper.badRequest(res, 'Cannot create a new chat!')
    try {
      const existingHostChat = await chatService.findOneByHostGuestId(
        req.userId,
        guestId,
      )
      if (existingHostChat)
        return responseHelper.badRequest(res, 'Chat room already exists!')
      const existingGuestChat = await chatService.findOneByHostGuestId(
        guestId,
        req.userId,
      )
      const guestChatId = existingGuestChat ? existingGuestChat.id : null
      const newChat = await chatService.createOne({
        host_id: req.userId,
        guest_id: guestId,
        guest_chat_id: guestChatId,
        readed: true,
      })
      const newChatInfo = await chatService.findOneById(newChat.id)
      if (existingGuestChat) {
        await chatService.updateOneGuestChatId(newChat.id, existingGuestChat.id)
        await cache.delCache(`list chats of user: ${guestId}`)
      }
      await cache.delCache(`list chats of user: ${req.userId}`)
      return responseHelper.responseSuccess(
        res,
        'Create a new chat successfully',
        { new_chat: newChatInfo },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const getListChats = async (req: any, res: Response) => {
    try {
      let listChats = await cache.getCache(`list chats of user: ${req.userId}`)
      if (listChats === null) {
        listChats = await chatService.findByHostId(req.userId)
        await cache.setCache(`list chats of user: ${req.userId}`, listChats)
      }
      return responseHelper.responseSuccess(
        res,
        'Get list chats successfully',
        { list_chats: listChats },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const deleteChat = async (req: any, res: Response) => {
    const chatId = req.query.chat_id.trim()
    const guestId = req.query.guest_id.trim()
    let guestChatId = req.query.guest_chat_id.trim()
    if (!guestChatId || guestChatId === 'null') {
      guestChatId = null
    }
    try {
      const deletedChat = await chatService.deleteOne(chatId, req.userId)
      if (deletedChat === 0)
        return responseHelper.badRequest(res, 'Cannot delete chat room!')
      await messageService.deleteByChatId(chatId)
      if (guestChatId) {
        await chatService.updateOneGuestChatId(null, guestChatId)
        await cache.delCache(`list chats of user: ${guestId}`)
      }
      await cache.delCache(`list chats of user: ${req.userId}`)
      return responseHelper.responseSuccess(res, 'Delete chat successfully', {
        deleted_chat: deletedChat,
        chat_id: chatId,
        guest_chat_id: guestChatId,
        guest_id: guestId,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateReaded = async (req: any, res: Response) => {
    const chat_id = req.body.chat_id?.trim()
    try {
      await chatService.updateOneReaded(chat_id, true)
      await cache.delCache(`list chats of user: ${req.userId}`)
      return responseHelper.responseSuccess(res, 'Update readed successfully', {
        chat_id,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  return {
    createNewChat,
    getListChats,
    deleteChat,
    updateReaded,
  }
}
