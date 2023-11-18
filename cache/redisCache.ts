import { Redis } from '@upstash/redis'
import { redisUrl, redisToken, withCache } from 'utils'

import { createHmac } from './createHmac'
 
const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})

export const enum TTL {
  Forever = -1,
  Day = 60 * 60 * 24,
  Week = 60 * 60 * 24 * 7,
  Month = 60 * 60 * 24 * 30,
  Year = 60 * 60 * 24 * 365,
  Error = 60 * 60 * 24,
}

const getFromCache = (containerId: string, id: string) =>
  redis.get(`${containerId}_${createHmac(id)}`)

const putInCache = (containerId: string, id: string, value, ttl: TTL) =>
  redis.set(`${containerId}_${createHmac(id)}`, value, {
    ex: ttl !== TTL.Forever ? ttl : undefined,
  })

const executeAndPutInCache = (
  containerId: string,
  id: string,
  operation: () => Promise<any>,
  ttl: TTL
) =>
  operation()
    .then((data) => {
      // console.log({ containerId, id, data, type: typeof data })
      putInCache(containerId, id, data, ttl)
      return data;
    })
    .catch((error) =>
      putInCache(containerId, id, { error }, TTL.Error).catch(
        (error) => {
          console.error(`executeAndPutInCache ${containerId}`, error)
          return []
        }
      )
    )

export const getWithCache = async (
  containerId: string,
  id: string,
  operation: () => Promise<any>,
  ttl: TTL
) =>
  withCache
    ? getFromCache(containerId, id).then((data) => {
        // console.log({ containerId, id, data, type: typeof data })
        if (data !== undefined && data !== null) {
          return data?.error ?? data
        }
        return executeAndPutInCache(containerId, id, operation, ttl)
      })
    : operation().catch((error) => {
        console.error(`getWithCache ${containerId}`, error)
        return []
      })
