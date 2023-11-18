import { useQuery } from '@tanstack/react-query'

const getAPI = async (params) => {
  const [resource, queryParams] = params.queryKey

  if (queryParams) {
    const query = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const response = await fetch(`/api/${resource}?${query}`)
    if (!response.ok) {
      throw new Error(`Problem fetching ${resource} data`)
    }
    return await response.json()
  }

  return []
}

export const useAPI = (resource: string) => (queryParams: any) =>
  useQuery({ queryKey: [resource, queryParams], queryFn: getAPI})
