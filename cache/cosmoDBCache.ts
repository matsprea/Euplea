import { CosmosClient } from '@azure/cosmos'
import { createHmac } from './createHmac'

const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT
const COSMOS_KEY = process.env.COSMOS_KEY

const client =
  COSMOS_ENDPOINT &&
  new CosmosClient({ endpoint: COSMOS_ENDPOINT, key: COSMOS_KEY })
const EupleaDb = client?.database('Euplea')

export const enum TTL {
  Forever = -1,
  Day = 60 * 60 * 24,
  Week = 60 * 60 * 24 * 7,
  Month = 60 * 60 * 24 * 30,
  Year = 60 * 60 * 24 * 365,
  Error = 60 * 60 * 24,
}

const getContainer = async (containerId: string) => {
  const { container, resource } = await EupleaDb.containers
    .createIfNotExists({
      id: containerId,
      partitionKey: '/id',
    })
    .catch((error) => {
      console.error(`getContainer ${containerId}`, error)
      return { container: null, resource: null }
    })

  if (container && resource.defaultTtl !== -1) {
    await container.replace({ ...resource, defaultTtl: TTL.Forever })
  }

  return container
}

const getResourceFromItem = ({ resource }) => resource

const getItem = (containerId: string, id: string) =>
  getContainer(containerId)
    .then((container) => container?.item(id, id))
    .catch((error) => {
      console.error(`getItem ${containerId} ${id}`, error)
      throw error
    })

const getFromCache = async (containerId: string, id: string) =>
  (await getItem(containerId, createHmac(id))).read().then(getResourceFromItem)

const putInCache = async (containerId: string, id: string, value, ttl: TTL) =>
  EupleaDb &&
  getContainer(containerId).then((container) =>
    container.items
      .upsert({
        id: createHmac(id),
        value,
        ttl,
      })
      .then(getResourceFromItem)
      .catch((error) => {
        console.error(`putInCache ${containerId} ${id}`, error)
        return value
      })
  )

const executeAndPutInCache = (
  containerId: string,
  id: string,
  operation: () => Promise<any>,
  ttl: TTL
) =>
  operation()
    .then((data) => putInCache(containerId, id, data, ttl))
    .catch((error) =>
      putInCache(containerId, id, { error, key: id }, TTL.Error).catch(
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
  ttl: TTL = TTL.Year
) =>
  EupleaDb
    ? getFromCache(containerId, id).then((data) => {
        if (
          data?.value?.date &&
          data.value.date + 1000 * TTL.Error < Date.now()
        ) {
          return executeAndPutInCache(containerId, id, operation, ttl)
        }
        if (data !== undefined && data !== null) {
          return data?.error ?? data
        }
        return executeAndPutInCache(containerId, id, operation, ttl)
      })
    : operation().catch((error) => {
        console.error(`getWithCache ${containerId}`, error)
        return []
      })
