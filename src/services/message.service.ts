import { ICreateMessageDto } from '../interfaces'
import { ICradle } from '../container'
import { LIMIT_MESSAGES } from '../constants'

export const messageService = ({ initSequelize }: ICradle) => {
  const { messages } = initSequelize.models

  const createOne = async (createMessageDto: ICreateMessageDto) =>
    await messages.create(createMessageDto)

  const findByChatId = async (chat_id: string, page: number) =>
    (
      await messages.findAll({
        where: {
          chat_id,
        },
        order: [['created_at', 'DESC']],
        offset: (page - 1) * LIMIT_MESSAGES,
        limit: LIMIT_MESSAGES,
      })
    ).reverse()

  const deleteByChatId = async (chat_id: string) =>
    await messages.destroy({
      where: {
        chat_id,
      },
    })

  const udpateOneGuestMessageId = async (
    guest_message_id: string,
    message_id: string,
  ) =>
    await messages.update(
      {
        guest_message_id,
      },
      {
        where: {
          id: message_id,
        },
        returning: true,
      },
    )

  const updateOneEmoji = async (emoji: string | null, message_id: string) =>
    await messages.update(
      {
        emoji,
      },
      {
        where: {
          id: message_id,
        },
        returning: true,
      },
    )

  return {
    createOne,
    findByChatId,
    deleteByChatId,
    udpateOneGuestMessageId,
    updateOneEmoji,
  }
}
