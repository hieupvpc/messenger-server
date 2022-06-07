import { createClient } from 'redis'
import { ICradle } from '../container'

export const cache = ({ envs }: ICradle) => {
  const redisClient = createClient({
    url: `redis://${envs.REDIS_HOST}:${envs.REDIS_PORT}`,
  })

  const EXPIRE_TIME_REDIS = 3600

  const getCache = async (key: string) =>
    JSON.parse((await redisClient.get(key)) || 'null')

  const setCache = async (key: string, value: any) =>
    await redisClient.setEx(key, EXPIRE_TIME_REDIS, JSON.stringify(value))

  const setExCache = async (key: string, expire_time: number, value: any) =>
    await redisClient.setEx(key, expire_time, JSON.stringify(value))

  const delCache = async (key: string) => await redisClient.del(key)

  const delCacheByPattern = async (pattern: string) => {
    const keys = await redisClient.keys(pattern)
    keys.length > 0 && (await redisClient.del(keys))
  }

  return {
    redisClient,
    getCache,
    setCache,
    setExCache,
    delCache,
    delCacheByPattern,
  }
}
