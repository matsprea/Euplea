import { Style, Region } from 'types'

export type SearchData = {
  subject: string
  days: number
  style: Style
  region?: Region
  accomodationRadius?: number
  amenityRadius?: number
}
