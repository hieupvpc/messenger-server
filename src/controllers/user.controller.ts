import { hash, verify } from 'argon2'
import { Response } from 'express'
import { sign } from 'jsonwebtoken'
import { ICradle } from '../container'

export const userController = ({ helpers, services, envs, cache }: ICradle) => {
  const { responseHelper, convertHelper } = helpers
  const { userService } = services

  const registerNewUser = async (req: any, res: Response) => {
    const phoneOrEmail = req.body.phone_or_email.trim()
    const password = req.body.password.trim()
    const fullname = req.body.fullname.trim()
    try {
      const existingUser =
        req.type === 'email'
          ? await userService.findOneByEmail(phoneOrEmail)
          : await userService.findOneByPhoneNum(phoneOrEmail)
      if (existingUser)
        return responseHelper.badRequest(
          res,
          `${
            req.type === 'email' ? 'Email' : 'Phone number'
          } already exists, please choose another one!`,
        )
      const hashedPassword = await hash(`${password}${envs.ENCRYPT_PASSWORD}`)
      const createNewUser = (
        phone_number: string | null,
        email: string | null,
      ) => ({
        phone_number,
        email,
        password: hashedPassword,
        fullname,
        fresh_name: convertHelper.removeAccents(fullname),
      })
      await userService.createOne(
        req.type === 'email'
          ? createNewUser(null, phoneOrEmail)
          : createNewUser(phoneOrEmail, null),
      )
      await cache.delCacheByPattern('list users searched by pattern:*')
      return responseHelper.responseSuccess(
        res,
        'Successful account registration',
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const loginAccountUser = async (req: any, res: Response) => {
    const phoneOrEmail = req.body.phone_or_email.trim()
    const password = req.body.password.trim()
    try {
      const existingUser =
        req.type === 'email'
          ? await userService.findOneByEmail(phoneOrEmail)
          : await userService.findOneByPhoneNum(phoneOrEmail)
      if (!existingUser)
        return responseHelper.badRequest(
          res,
          `${
            req.type === 'email' ? 'Email' : 'Phone number'
          } or password incorrect, please try again!`,
        )
      const verifyPassword = await verify(
        existingUser.password,
        `${password}${envs.ENCRYPT_PASSWORD}`,
      )
      if (!verifyPassword)
        return responseHelper.badRequest(
          res,
          `${
            req.type === 'email' ? 'Email' : 'Phone number'
          } or password incorrect, please try again!`,
        )
      await userService.updateOneStatusOnline(true, existingUser.id)
      const accessToken = sign(
        { userId: existingUser.id },
        envs.ACCESS_TOKEN_SECRET,
      )
      await cache.delCache(`info of user: ${existingUser.id}`)
      await cache.delCacheByPattern('list users searched by pattern:*')
      await cache.delCacheByPattern('list chats of user:*')
      return responseHelper.responseSuccess(res, 'Logged in successfully', {
        access_token: accessToken,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const logoutAccountUser = async (req: any, res: Response) => {
    try {
      await userService.updateOneStatusOnline(false, req.userId)
      await userService.updateOneLastLogout(req.userId)
      await cache.delCache(`info of user: ${req.userId}`)
      await cache.delCacheByPattern('list users searched by pattern:*')
      await cache.delCacheByPattern('list chats of user:*')
      return responseHelper.responseSuccess(res, 'Log out account successfully')
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const changeAvatar = async (req: any, res: Response) => {
    const newAvatar = req.body.new_avatar?.trim() || null
    try {
      const updatedUser = (
        await userService.updateOneAvatar(newAvatar, req.userId)
      )[1][0]
      await cache.delCache(`info of user: ${req.userId}`)
      await cache.delCacheByPattern('list users searched by pattern:*')
      await cache.delCacheByPattern('list chats of user:*')
      return responseHelper.responseSuccess(
        res,
        'Update new avatar successfully',
        { new_avatar: updatedUser.avatar },
      )
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const getMyInfo = async (req: any, res: Response) => {
    try {
      let myInfo = await cache.getCache(`info of user: ${req.userId}`)
      if (myInfo === null) {
        myInfo = await userService.findOneById(req.userId)
        await cache.setCache(`info of user: ${req.userId}`, myInfo)
      }
      return responseHelper.responseSuccess(res, 'Get my info successfully', {
        my_info: myInfo,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  const searchUsers = async (req: any, res: Response) => {
    const pattern = req.query.pattern.trim()
    try {
      let listUsers = await cache.getCache(
        `list users searched by pattern: ${pattern}`,
      )
      if (listUsers === null) {
        listUsers = await userService.findByPattern(pattern)
        await cache.setCache(
          `list users searched by pattern: ${pattern}`,
          listUsers,
        )
      }
      return responseHelper.responseSuccess(res, 'Search users successfully', {
        list_users: listUsers,
      })
    } catch (error) {
      console.log(error)
      return responseHelper.internalServerError(res)
    }
  }

  return {
    registerNewUser,
    loginAccountUser,
    logoutAccountUser,
    changeAvatar,
    getMyInfo,
    searchUsers,
  }
}
