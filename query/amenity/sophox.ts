import {
  mySparQLQuery,
  sourcesSophox as sources,
  prefixSophox as prefix,
} from 'query'
import { getWithCache } from 'cache'
import { Style } from 'types'
import { amenityStyle } from './settings'
import { amenityMaxCount, withCache } from 'utils'

const amenityStyleToSparql = (style: Style) =>
  amenityStyle(style)
    .map((amenity) => `'${amenity}'`)
    .join(' ')

const query = (
  lat: number,
  long: number,
  style: Style,
  radius: number
) => `${prefix}
SELECT * WHERE {
  VALUES ?amenity { ${amenityStyleToSparql(style)} }

  ?osmid osmt:name ?name .
  ?osmid osmt:amenity ?amenity ;
   
   SERVICE wikibase:around {
     ?osmid osmm:loc ?coordinates.
     bd:serviceParam wikibase:center "Point(${long} ${lat})"^^geo:wktLiteral.
     bd:serviceParam wikibase:radius "${radius}". # kilometers
     bd:serviceParam wikibase:distance ?distance.
   }
}
ORDER BY ASC(?distance)
LIMIT ${amenityMaxCount}
`

const containerId = 'amenitySophox'

const getSparqlAmenitiesWithNoCache = (lat: number, long: number, style: Style, radius: number) =>
  mySparQLQuery(query(lat, long, style, radius), sources)

const getSparqlAmenitiesWithCache = (
  lat: number,
  long: number,
  style: Style,
  radius: number
) =>
  getWithCache(containerId, `sophox-${lat}-${long}-${style}-${radius}`, () =>
    getSparqlAmenitiesWithNoCache(lat, long, style, radius)
  ).then(({ value }) => !('error' in value) && value)

export const getSparqlAmenities = withCache
  ? getSparqlAmenitiesWithCache
  : getSparqlAmenitiesWithNoCache
