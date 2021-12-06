import { SearchData } from '../types'
import { useQuery } from 'react-query'

const getAPI = (resource: string) => async (params) => {
  const [, { topic, days, style }] = params.queryKey

  if (topic) {
    const response = await fetch(
      `/api/${resource}?topic=${topic}&days=${days}&style=${style}`
    )
    if (!response.ok) {
      throw new Error(`Problem fetching ${resource} data`)
    }
    const topics = await response.json().then(({ value }) => value)

    return topics
  }
}

export const useAPI = (resource: string) => (searchData: SearchData) =>
  useQuery([resource, searchData], getAPI(resource))
