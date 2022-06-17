import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createServer } from 'http'
import { ICradle } from './container'
import pg from 'pg'
import { Dialect, Sequelize } from 'sequelize'
import { models } from './models'
import { sockets } from './sockets'

export const initSequelize = ({ envs }: ICradle) => {
  const sequelize = new Sequelize(
    envs.DB_NAME,
    envs.DB_USER,
    envs.DB_PASSWORD,
    {
      host: envs.DB_HOST,
      dialectModule: pg,
      dialect: envs.DB as Dialect,
      logging: false,
      port: envs.DB_PORT,
      pool: {
        max: 10,
        min: 1,
        idle: 20000,
        acquire: 50000,
        evict: 1000,
      },
    },
  )

  return {
    sequelize,
    models: models(sequelize),
  }
}

export const setup = async ({ initSequelize, cache }: ICradle) => {
  await cache.redisClient.connect()
  await initSequelize.sequelize.sync()
  console.log('🚀🚀🚀 PostgreSQL connected 🚀🚀🚀')
}

export const startServer = ({ envs, routers }: ICradle) => {
  const app = express()
  const server = createServer(app)
  const port = envs.PORT

  server.listen(port, () =>
    console.log(`--- Server is running on port ${port} ---`),
  )

  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(express.json({ limit: '10mb' }))
  app.use(cors())
  app.use(helmet())
  app.use(compression())

  app.use(routers)

  sockets(server)
}
