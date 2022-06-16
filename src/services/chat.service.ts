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

  const findOneById = async (chat_id: string) =>
    await chats.findOne({
      where: {
        id: chat_id,
      },
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
        },
      ],
    })

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

  const updateOneReaded = async (chat_id: string, readed: boolean) =>
    await chats.update(
      { readed },
      {
        where: {
          id: chat_id,
        },
        returning: true,
      },
    )

  const updateOneNickname = async (
    data: {
      nickname_host: string | null
      nickname_guest: string | null
    },
    chat_id: string,
  ) =>
    await chats.update(data, {
      where: {
        id: chat_id,
      },
      returning: true,
    })

  const updateOneColor = async (color: string, chat_id: string) =>
    await chats.update(
      {
        color,
      },
      {
        where: {
          id: chat_id,
        },
        returning: true,
      },
    )

  const updateOneBackgroundColor = async (
    background_color: string,
    chat_id: string,
  ) =>
    await chats.update(
      {
        background_color,
      },
      {
        where: {
          id: chat_id,
        },
        returning: true,
      },
    )

  const updateOneEmoji = async (emoji: string, chat_id: string) =>
    await chats.update(
      {
        emoji,
      },
      {
        where: {
          id: chat_id,
        },
        returning: true,
      },
    )

  return {
    findOneByHostGuestId,
    updateOneGuestChatId,
    createOne,
    findByHostId,
    deleteOne,
    findOneById,
    updateOneReaded,
    updateOneNickname,
    updateOneColor,
    updateOneBackgroundColor,
    updateOneEmoji,
  }
}
