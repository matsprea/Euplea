import { getWithCache } from 'cache'
import queryOverpass from '@derhuerst/query-overpass'
import { Style } from 'types'
import { hostelStyle, tourismStyle } from './settings'

const turism =
  (lat: number, long: number, radius: number) => (turism: string) =>
    `way["tourism"="${turism}"](around: ${
      radius * 1000
    }, ${lat}, ${long});node(w:1,-2);
  node["tourism"="${turism}"](around: ${radius * 1000},  ${lat}, ${long});`

const queryTurism = (lat: number, long: number, style: Style, radius) =>
  tourismStyle(style).map(turism(lat, long, radius)).join('\n')

const hotel = (lat: number, long: number, radius: number) => (star: string) =>
  `way["tourism"="hotel"]["stars" = "${star}" ](around: ${
    radius * 1000
  }, ${lat}, ${long});node(w:1,-2);
  node["tourism"="hotel"]["stars" = "${star}" ](around: ${
    radius * 1000
  },  ${lat}, ${long});`

const queryHotel = (lat: number, long: number, style: Style, radius: number) =>
  hostelStyle(style).map(hotel(lat, long, radius)).join('\n')

const query = (lat: number, long: number, style: Style, radius: number) => `
[out:json][timeout:25];
(
    ${queryHotel(lat, long, style, radius)}
    ${queryTurism(lat, long, style, radius)}
 );
out body;`

const containerId = 'accomodation'

export const getOverpassAccomodations = (
  lat: number,
  long: number,
  style: Style,
  radius: number
) =>
  getWithCache(containerId, `overpass-${lat}-${long}-${style}-${radius}`, () =>
    queryOverpass(query(lat, long, style, radius)).then((results) =>
      results.filter((item) => item.type === 'node')
    )
  ).then(({ value }) => value)
