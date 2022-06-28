import { NextFunction, Response } from 'express'
import { ICradle } from '../container'
import _ from 'lodash'

export const validateMiddlewares = ({ helpers }: ICradle) => {
  const { responseHelper, checkValue } = helpers

  const validateRegisterInput = (
    req: any,
    res: Response,
    next: NextFunction,
  ): any => {
    const phone_or_email = _.trim(req.body.phone_or_email)
    const password = _.trim(req.body.password)
    const repassword = _.trim(req.body.repassword)
    const fullname = _.trim(req.body.fullname)
    if (!phone_or_email || !password || !repassword || !fullname)
      return responseHelper.badRequest(res, 'You must fill in all the fields!')
    const typeAccount = validateTypeAccount(phone_or_email)
    if (!typeAccount)
      return responseHelper.badRequest(res, 'Invalid phone number or email!')
    req.type = typeAccount
    if (_.size(password) < 6 || _.size(password) > 30)
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
    if (_.size(fullname) > 50)
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
    const phone_or_email = _.trim(req.body.phone_or_email)
    const password = _.trim(req.body.password)
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
