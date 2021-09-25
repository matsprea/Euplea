import { useQuery } from 'react-query'
import axios from 'axios'

type agro = {
  id: string
  location: {
    latitude: number
    longitude: number
  }
  nome_agriturismo: string
}

const agroUrl = 'https://www.dati.lombardia.it/resource/xy9p-k9bj.json'
const DEFAULT_LIMIT = 1000

const getAgroCount = async () => {
  const { data } = await axios.get(`${agroUrl}?$select=count(id)`)
  const [count] = data
  return count?.count_id || 0
}

export const useAgroCount = () => useQuery<number>('agroCount', getAgroCount)

const getAgroPaged = async (limit = DEFAULT_LIMIT, offset = 0) => {
  const { data } = await axios.get(
    `${agroUrl}?$limit=${limit}&$offset=${offset}`
  )
  return data as agro[]
}

export const useAgro = (limit = DEFAULT_LIMIT, offset = 0) =>
  useQuery(['agro', limit, offset], () => getAgroPaged(limit, offset))
