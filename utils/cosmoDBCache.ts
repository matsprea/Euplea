import { CosmosClient } from '@azure/cosmos'
import { createHmac } from 'utils/createHmac'

const endpoint = process.env.COSMOS_ENDPOINT
const key = process.env.COSMOS_KEY

const client = endpoint && new CosmosClient({ endpoint, key })
const EupleaDb = client?.database('Euplea')

const ttlError = 60 * 60 * 24;

const getContainer = async (containerId: string) => {
  const { container } = await EupleaDb.containers.createIfNotExists({
    id: containerId,
    partitionKey: '/id',
  })
  return container
}

const getResourceFromItem = ({ resource }) => resource

const getItem = (containerId: string, id: string) =>
  getContainer(containerId).then((container) => container.item(id, id))

const updateItem =
  (containerId: string, id: string) =>
  async (value, ttl = -1) =>
    (await getItem(containerId, id))
      .replace({
        id,
        value,
        ttl,
      })
      .then(getResourceFromItem)

const getFromCache = async (containerId: string, id: string) =>
  (await getItem(containerId, id)).read().then(getResourceFromItem)

const putInCache = async (containerId: string, id: string, value, ttl = -1) =>
  EupleaDb &&
  getContainer(containerId).then((container) =>
    container.items
      .create({
        id,
        value,
        ttl,
      })
      .then(getResourceFromItem)
  )

export const getWithCache = async (
  containerId: string,
  key: string,
  operation: Promise<any>,
  ttl = -1
) =>
  EupleaDb &&
  getFromCache(containerId, createHmac(key)).then((data) => {
    if (data?.value?.date && data.value.date + 1000 * ttlError < Date.now()) {
      return operation.then((data) =>
        updateItem(containerId, createHmac(key))(data, ttlError)
      )
    }
    return (
      data ??
      operation
        .then((data) => putInCache(containerId, createHmac(key), data, ttl))
        .catch((error) =>
          putInCache(containerId, createHmac(key), { error, key }, ttlError)
        )
    )
  })
