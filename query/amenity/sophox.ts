import {
  mySparQLQuery,
  sourcesSophox as sources,
  prefixSophox as prefix,
} from 'query'
import { getWithCache } from 'cache'
import { Style } from 'types'
import { amenityStyle } from './settings'

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
LIMIT 10
`

const containerId = 'amenitySophox'

export const getSparqlAmenities = (
  lat: number,
  long: number,
  style: Style,
  radius: number
) =>
  getWithCache(containerId, `sophox-${lat}-${long}-${style}-${radius}`, () =>
    mySparQLQuery(query(lat, long, style, radius), sources)
  ).then(({ value }) => !('error' in value) && value)
