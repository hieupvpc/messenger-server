import { Response } from 'express'

export const responseHelper = () => {
  const internalServerError = (res: Response) =>
    res.status(500).json({
      status_code: 500,
      success: false,
      message: 'Internal server error!',
      data: null,
    })

  const badRequest = (res: Response, message: string) =>
    res.status(400).json({
      status_code: 400,
      success: false,
      message,
      data: null,
    })

  const responseSuccess = (res: Response, message: string, data: any = null) =>
    res.json({
      status_code: 200,
      success: true,
      message,
      data,
    })

  const response = (
    res: Response,
    status_code: number,
    success: boolean,
    message: string,
    data: any = null,
  ) => res.status(status_code).json({ status_code, success, message, data })

  return {
    internalServerError,
    badRequest,
    responseSuccess,
    response,
  }
}
