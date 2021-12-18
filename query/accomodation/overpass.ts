import { getWithCache } from 'cache'
import queryOverpass from '@derhuerst/query-overpass'
import { Style } from 'types'
import { hostelStyle, tourismStyle } from './style'

const accomodationRadius = 10000 // meters

const turism = (lat: number, long: number) => (turism: string) =>
  `way["tourism"="${turism}"](around: ${accomodationRadius}, ${lat}, ${long});(._;>;);
  node["tourism"="${turism}"](around: ${accomodationRadius},  ${lat}, ${long});`

const queryTurism = (lat: number, long: number, style: Style) =>
  tourismStyle(style).map(turism(lat, long)).join('\n')

const hotel = (lat: number, long: number) => (star: string) =>
  `way["tourism"="hotel"]["stars" = "${star}" ](around: ${accomodationRadius}, ${lat}, ${long});(._;>;);
  node["tourism"="hotel"]["stars" = "${star}" ](around: ${accomodationRadius},  ${lat}, ${long});`

const queryHotel = (lat: number, long: number, style: Style) =>
  hostelStyle(style).map(hotel(lat, long)).join('\n')

const query = (lat: number, long: number, style: Style) => `
[out:json][timeout:25];
(
    ${queryHotel(lat, long, style)}
    ${queryTurism(lat, long, style)}
 );
out body;`

const containerId = 'accomodation'

export const getOverpassAccomodations = (
  lat: number,
  long: number,
  style: Style
) =>
  getWithCache(
    containerId,
    `overpass-${lat}-${long}-${style}-${accomodationRadius}`,
    () => queryOverpass(query(lat, long, style))
  ).then(({ value }) => value)
