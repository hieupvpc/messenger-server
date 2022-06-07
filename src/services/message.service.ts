import { ICreateMessageDto } from '../interfaces'
import { ICradle } from '../container'

export const messageService = ({ initSequelize }: ICradle) => {
  const { messages } = initSequelize.models

  const createOne = async (createMessageDto: ICreateMessageDto) =>
    await messages.create(createMessageDto)

  const findByChatId = async (chat_id: string) =>
    await messages.findAll({
      where: {
        chat_id,
      },
    })

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
