import { NextFunction, Response } from 'express'
import { ICradle } from '../container'

export const validateMiddlewares = ({ helpers }: ICradle) => {
  const { responseHelper, checkValue } = helpers

  const validateRegisterInput = (
    req: any,
    res: Response,
    next: NextFunction,
  ): any => {
    const phone_or_email = req.body.phone_or_email.trim()
    const password = req.body.password.trim()
    const repassword = req.body.repassword.trim()
    const fullname = req.body.fullname.trim()
    if (!phone_or_email || !password || !repassword || !fullname)
      return responseHelper.badRequest(res, 'You must fill in all the fields!')
    const typeAccount = validateTypeAccount(phone_or_email)
    if (!typeAccount)
      return responseHelper.badRequest(res, 'Invalid phone number or email!')
    req.type = typeAccount
    if (password.length < 6 || password.length > 30)
      return responseHelper.badRequest(
        res,
        'Password must be between 6-30 characters in length!',
      )
    if (!/^\w+$/.test(password))
      return responseHelper.badRequest(
        res,
        'Password contains only lowercase letters (a-z), uppercase letters (A-Z), numbers (0-9) and underscores (_)!',
      )
    if (
      !/[a-z]/g.test(password) ||
      !/[A-Z]/g.test(password) ||
      !/[0-9]/g.test(password)
    )
      return responseHelper.badRequest(
        res,
        'Password must contain at least 1 lowercase letter (a-z), uppercase letter (A-Z) and number (0-9)!',
      )
    if (repassword !== password)
      return responseHelper.badRequest(
        res,
        'Password re-entered is incorrect, please try again!',
      )
    if (fullname.length > 50)
      return responseHelper.badRequest(
        res,
        'Fullname cannot exceed 50 characters!',
      )
    next()
  }

  const validateLoginInput = (
    req: any,
    res: Response,
    next: NextFunction,
  ): any => {
    const phone_or_email = req.body.phone_or_email.trim()
    const password = req.body.password.trim()
    if (!phone_or_email || !password)
      return responseHelper.badRequest(res, 'You must fill in all the fields!')
    const typeAccount = validateTypeAccount(phone_or_email)
    if (!typeAccount)
      return responseHelper.badRequest(res, 'Invalid phone number or email!')
    req.type = typeAccount
    next()
  }

  const validateTypeAccount = (phone_or_email: string) => {
    if (checkValue.isEmail(phone_or_email)) {
      return 'email'
    } else if (checkValue.isPhoneNumber(phone_or_email)) {
      return 'phone_number'
    } else return null
  }

  return {
    validateRegisterInput,
    validateLoginInput,
  }
}
