import { CosmosClient } from '@azure/cosmos'

const endpoint = process.env.COSMOS_ENDPOINT
const key = process.env.COSMOS_KEY

const client = new CosmosClient({ endpoint, key })
const EupleaDb = client.database('Euplea')

const getContainer = async (containerId) => {
  const { container } = await EupleaDb.containers.createIfNotExists({
    id: containerId,
    partitionKey: '/id',
  })
  return container
}

const getResourceFromItem = ({ resource }) => resource

export const getFromCache = async (containerId: string, key: string) =>
  getContainer(containerId).then((container) =>
    container.item(key, key).read().then(getResourceFromItem)
  )

export const putInCache = async (containerId: string, key: string, value) =>
  getContainer(containerId).then((container) =>
    container.items
      .create({
        id: key,
        value: value,
      })
      .then(getResourceFromItem)
  )

const getValue = (resource) => {
  const { value } = resource
  return value
}

export const getWithCache = async (
  containerId: string,
  key: string,
  operation: Promise<any>
) =>
  getFromCache(containerId, key).then(
    (data) =>
      data ?? operation.then((data) => putInCache(containerId, key, data))
  )
