import { CosmosClient } from '@azure/cosmos'
import { createHmac } from 'utils/createHmac'

const endpoint = process.env.COSMOS_ENDPOINT
const key = process.env.COSMOS_KEY

const client = endpoint && new CosmosClient({ endpoint, key })
const EupleaDb = client?.database('Euplea')

const getContainer = async (containerId: string) => {
  const { container } = await EupleaDb.containers.createIfNotExists({
    id: containerId,
    partitionKey: '/id',
  })
  return container
}

const getResourceFromItem = ({ resource }) => resource

export const getFromCache = async (containerId: string, key: string) =>
  getContainer(containerId).then((container) =>
    container
      .item(createHmac(key), createHmac(key))
      .read()
      .then(getResourceFromItem)
  )

export const putInCache = async (containerId: string, key: string, value) =>
  EupleaDb &&
  getContainer(containerId).then((container) =>
    container.items
      .create({
        id: createHmac(key),
        value: value,
      })
      .then(getResourceFromItem)
  )

export const getWithCache = async (
  containerId: string,
  key: string,
  operation: Promise<any>
) =>
  EupleaDb &&
  getFromCache(containerId, key).then(
    (data) =>
      data ?? operation.then((data) => putInCache(containerId, key, data))
  )
