import { SearchData } from '../types'
import { useQuery } from 'react-query'

const getCulturalSites = async (params) => {
  const [, { topic, days }] = params.queryKey

  if (topic) {
    const response = await fetch(
      `/api/culturalSite?topic=${topic}&days=${days}`
    )
    if (!response.ok) {
      throw new Error('Problem fetching data')
    }
 
    return await response.json()
  }
}

export const useCulturalSites = (searchData: SearchData) =>
  useQuery(['culturalSites', searchData], getCulturalSites)
