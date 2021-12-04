import { SearchData } from '../types'
import { useQuery } from 'react-query'

async function getTopic(params) {
  const [, { topic }] = params.queryKey

  if (topic) {
    const response = await fetch(`/api/topic?topic=${topic}`)
    if (!response.ok) {
      throw new Error('Problem fetching data')
    }
    const topics = await response.json().then(({ value }) => value)

    return topics
  }
}

export const useTopics = (searchData: SearchData) => {
  return useQuery(['topics', searchData], getTopic)
}
