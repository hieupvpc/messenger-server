import dotenv from 'dotenv'
dotenv.config()

export interface IEnvs {
  NODE_ENV: string

  PORT: number
  ACCESS_TOKEN_SECRET: string
  ENCRYPT_PASSWORD: string

  DB: string
  DB_HOST: string
  DB_PORT: number
  DB_NAME: string
  DB_USER: string
  DB_PASSWORD: string

  REDIS_HOST: string
  REDIS_PORT: number
}

export const envs = (): IEnvs => ({
  NODE_ENV: process.env.NODE_ENV || '',

  PORT: process.env.PORT ? +process.env.PORT : 0,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
  ENCRYPT_PASSWORD: process.env.ENCRYPT_PASSWORD || '',

  DB: process.env.DB || '',
  DB_HOST: process.env.DB_HOST || '',
  DB_PORT: process.env.DB_PORT ? +process.env.DB_PORT : 0,
  DB_NAME: process.env.DB_NAME || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',

  REDIS_HOST: process.env.REDIS_HOST || '',
  REDIS_PORT: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 0,
})
