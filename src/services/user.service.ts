import { ICreateUserDto } from '../interfaces'
import { ICradle } from '../container'
import moment from 'moment'
import { Op } from 'sequelize'

export const userService = ({ initSequelize }: ICradle) => {
  const { users } = initSequelize.models

  const findOneByPhoneNum = async (phone_number: string) =>
    await users.findOne({
      where: {
        phone_number,
      },
    })

  const findOneByEmail = async (email: string) =>
    await users.findOne({
      where: {
        email,
      },
    })

  const createOne = async (createUserDto: ICreateUserDto) =>
    await users.create(createUserDto)

  const updateOneStatusOnline = async (
    status_online: boolean,
    user_id: string,
  ) =>
    await users.update(
      {
        status_online,
      },
      {
        where: {
          id: user_id,
        },
        returning: true,
      },
    )

  const updateOneLastLogout = async (user_id: string) =>
    await users.update(
      {
        last_logout: moment(),
      },
      {
        where: {
          id: user_id,
        },
        returning: true,
      },
    )

  const updateOneAvatar = async (new_avatar: string, user_id: string) =>
    await users.update(
      {
        avatar: new_avatar,
      },
      {
        where: {
          id: user_id,
        },
        returning: true,
      },
    )

  const findOneById = async (user_id: string) =>
    await users.findOne({
      where: {
        id: user_id,
      },
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
    })

  const findByPattern = async (pattern: string) =>
    await users.findAll({
      where: {
        [Op.or]: [
          {
            phone_number: {
              [Op.iLike]: `%${pattern}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${pattern}%`,
            },
          },
          {
            fresh_name: {
              [Op.iLike]: `%${pattern}%`,
            },
          },
        ],
      },
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
    })

  return {
    findOneByPhoneNum,
    findOneByEmail,
    createOne,
    updateOneStatusOnline,
    updateOneLastLogout,
    updateOneAvatar,
    findOneById,
    findByPattern,
  }
}
