import { SearchData } from '../types'
import { useQuery } from 'react-query'

const getAPI = async (params) => {
  const [resource, { topic, days, style }] = params.queryKey

  if ((topic && days && style)) {
    const response = await fetch(
      `/api/${resource}?topic=${topic}&days=${days}&style=${style}`
    )
    if (!response.ok) {
      throw new Error(`Problem fetching ${resource} data`)
    }
    return await response.json()
  }
}

export const useAPI = (resource: string) => (searchData: SearchData) =>
  useQuery([resource, searchData], getAPI)
