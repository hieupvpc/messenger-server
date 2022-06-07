import { ICreateChatDto } from '../interfaces'
import { ICradle } from '../container'

export const chatService = ({ initSequelize }: ICradle) => {
  const { chats, users, messages } = initSequelize.models

  const findOneByHostGuestId = async (host_id: string, guest_id: string) =>
    await chats.findOne({
      where: {
        host_id,
        guest_id,
      },
    })

  const updateOneGuestChatId = async (
    guest_chat_id: string | null,
    chat_id: string,
  ) =>
    await chats.update(
      {
        guest_chat_id,
      },
      {
        where: {
          id: chat_id,
        },
        returning: true,
      },
    )

  const createOne = async (createChatDto: ICreateChatDto) =>
    await chats.create(createChatDto)

  const findByHostId = async (host_id: string) =>
    await chats.findAll({
      where: {
        host_id,
      },
      order: [['created_at', 'DESC']],
      attributes: {
        exclude: ['host_id', 'guest_id'],
      },
      include: [
        {
          model: users,
          as: 'host',
          foreignKey: 'host_id',
          attributes: {
            exclude: [
              'phone_number',
              'email',
              'password',
              'created_at',
              'updated_at',
              'deleted_at',
            ],
          },
        },
        {
          model: users,
          as: 'guest',
          foreignKey: 'guest_id',
          attributes: {
            exclude: [
              'phone_number',
              'email',
              'password',
              'created_at',
              'updated_at',
              'deleted_at',
            ],
          },
        },
        {
          model: messages,
          as: 'last_message',
          order: [['created_at', 'DESC']],
          limit: 1,
          attributes: {
            exclude: ['receiver_id', 'chat_id', 'updated_at', 'deleted_at'],
          },
        },
      ],
    })

  const deleteOne = async (chat_id: string, host_id: string) =>
    await chats.destroy({
      where: {
        id: chat_id,
        host_id,
      },
    })

  return {
    findOneByHostGuestId,
    updateOneGuestChatId,
    createOne,
    findByHostId,
    deleteOne,
  }
}
