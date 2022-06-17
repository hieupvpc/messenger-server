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

  return {
    createOne,
    findByChatId,
    deleteByChatId,
  }
}
