import { Response } from 'express'
import {
  BACKGROUND_COLOR,
  IUpdateNicknameDto,
  MAIN_COLOR,
  MAIN_EMOJI,
} from '../interfaces'
import { ICradle } from '../container'
import { BACKGROUND_COLORS, MAIN_COLORS, MAIN_EMOJIS } from '../constants'

export const chatController = ({ helpers, services, cache }: ICradle) => {
  const { responseHelper, cacheHelper } = helpers
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
        nickname_host: existingGuestChat?.nickname_guest || null,
        nickname_guest: existingGuestChat?.nickname_host || null,
        color: existingGuestChat?.color || '#0a7cff',
        background_color: existingGuestChat?.background_color || '#fff',
        emoji: existingGuestChat?.emoji || 'fas fa-thumbs-up',
      })
      const newChatInfo = await chatService.findOneById(newChat.id)
      if (existingGuestChat) {
        await chatService.updateOneGuestChatId(newChat.id, existingGuestChat.id)
        await cache.delCache(cacheHelper.listChatsOfUser(guestId))
      }
      await cache.delCache(cacheHelper.listChatsOfUser(req.userId))
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
      let listChats = await cache.getCache(
        cacheHelper.listChatsOfUser(req.userId),
      )
      if (listChats === null) {
        listChats = await chatService.findByHostId(req.userId)
        await cache.setCache(cacheHelper.listChatsOfUser(req.userId), listChats)
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
      await cache.delCacheByPattern(cacheHelper.listMessagesOfChat(chatId))
      if (guestChatId) {
        await chatService.updateOneGuestChatId(null, guestChatId)
        await cache.delCache(cacheHelper.listChatsOfUser(guestId))
      }
      await cache.delCache(cacheHelper.listChatsOfUser(req.userId))
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
      await cache.delCache(cacheHelper.listChatsOfUser(req.userId))
      return responseHelper.responseSuccess(res, 'Update readed successfully', {
        chat_id,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateNickname = async (req: any, res: Response) => {
    const updateNicknameDto: IUpdateNicknameDto = req.body
    const chatId = updateNicknameDto.chat_id
    let guestChatId = updateNicknameDto.guest_chat_id
    const guestId = updateNicknameDto.guest_id
    try {
      await chatService.updateOneNickname(updateNicknameDto.data, chatId)
      await chatService.updateOneNickname(
        {
          nickname_host: updateNicknameDto.data.nickname_guest,
          nickname_guest: updateNicknameDto.data.nickname_host,
        },
        guestChatId,
      )
      await cache.delCache(cacheHelper.listChatsOfUser(req.userId))
      await cache.delCache(cacheHelper.listChatsOfUser(guestId))
      return responseHelper.responseSuccess(
        res,
        'Update nickname successfully',
        {
          updated_nickname: updateNicknameDto.data,
          guest_id: guestId,
          guest_chat_id: guestChatId,
        },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateColor = async (req: any, res: Response) => {
    const color: MAIN_COLOR | null = req.body.color?.trim() || null
    const chatId = req.body.chat_id?.trim() || null
    const guestId = req.body.guest_id?.trim() || null
    let guestChatId = req.body.guest_chat_id?.trim() || null
    if (!chatId || !guestId || !color)
      return responseHelper.badRequest(res, 'Cannot update color!')
    if (!MAIN_COLORS.includes(color))
      return responseHelper.badRequest(res, 'Invalid color!')
    try {
      await chatService.updateOneColor(color, chatId)
      await chatService.updateOneColor(color, guestChatId)
      await cache.delCache(cacheHelper.listChatsOfUser(req.userId))
      await cache.delCache(cacheHelper.listChatsOfUser(guestId))
      return responseHelper.responseSuccess(res, 'Change color successfully', {
        color,
        guest_chat_id: guestChatId,
        guest_id: guestId,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateBackgroundColor = async (req: any, res: Response) => {
    const backgroundColor: BACKGROUND_COLOR | null =
      req.body.background_color?.trim() || null
    const chatId = req.body.chat_id?.trim() || null
    const guestId = req.body.guest_id?.trim() || null
    let guestChatId = req.body.guest_chat_id?.trim() || null
    if (!chatId || !guestId || !backgroundColor)
      return responseHelper.badRequest(res, 'Cannot update color!')
    if (!BACKGROUND_COLORS.includes(backgroundColor))
      return responseHelper.badRequest(res, 'Invalid color!')
    try {
      await chatService.updateOneBackgroundColor(backgroundColor, chatId)
      await chatService.updateOneBackgroundColor(backgroundColor, guestChatId)
      await cache.delCache(cacheHelper.listChatsOfUser(req.userId))
      await cache.delCache(cacheHelper.listChatsOfUser(guestId))
      return responseHelper.responseSuccess(
        res,
        'Change background color successfully',
        {
          background_color: backgroundColor,
          guest_chat_id: guestChatId,
          guest_id: guestId,
        },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const updateEmoji = async (req: any, res: Response) => {
    const emoji: MAIN_EMOJI | null = req.body.emoji?.trim() || null
    const chatId = req.body.chat_id?.trim() || null
    const guestId = req.body.guest_id?.trim() || null
    let guestChatId = req.body.guest_chat_id?.trim() || null
    if (!chatId || !guestId || !emoji)
      return responseHelper.badRequest(res, 'Cannot update emoji!')
    if (!MAIN_EMOJIS.includes(emoji))
      return responseHelper.badRequest(res, 'Invalid emoji!')
    try {
      await chatService.updateOneEmoji(emoji, chatId)
      await chatService.updateOneEmoji(emoji, guestChatId)
      await cache.delCache(cacheHelper.listChatsOfUser(req.userId))
      await cache.delCache(cacheHelper.listChatsOfUser(guestId))
      return responseHelper.responseSuccess(res, 'Change emoji successfully', {
        emoji,
        guest_chat_id: guestChatId,
        guest_id: guestId,
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
    updateNickname,
    updateColor,
    updateBackgroundColor,
    updateEmoji,
  }
}
