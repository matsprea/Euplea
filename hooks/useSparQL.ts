
import { useSparQLResult, SearchData } from '../types'
import { useFetcher } from './useFetcher'

export const useSparQL = (searchData: SearchData): useSparQLResult => {
  const fetchData = ({ topic }) =>
    fetch(`/api/topic?topic=${topic}`)
      .then((response) => response.json())
      .then(({ value }) => value)

  return useFetcher (fetchData, searchData)
}
