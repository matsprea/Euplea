import { getWithCache } from 'cache'
import queryOverpass from '@derhuerst/query-overpass'
import { Style } from 'types'
import { amenityStyle } from './settings'

const amenity =
  (lat: number, long: number, radius: number) => (amenity: string) =>
    `way["amenity"="${amenity}"](around: ${
      radius * 1000
    }, ${lat}, ${long});node(w:1,-2);
  node["amenity"="${amenity}"](around: ${radius * 1000},  ${lat}, ${long});`

const queryAmenity = (
  lat: number,
  long: number,
  style: Style,
  radius: number
) => amenityStyle(style).map(amenity(lat, long, radius)).join('\n')

const query = (lat: number, long: number, style: Style, radius: number) => `
[out:json][timeout:25];
(
    ${queryAmenity(lat, long, style, radius)}
 );
out body;`

const containerId = 'amenity'

export const getOverpassAmenities = (
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
