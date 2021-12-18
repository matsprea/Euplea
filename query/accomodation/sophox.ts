import {
  mySparQLQuery,
  sourcesSophox as sources,
  prefixSophox as prefix,
} from 'query'
import { getWithCache } from 'cache'
import { Style } from 'types'
import { hostelStyle, tourismStyle } from './settings'
  
const tourismStyleToSparql = (style: Style) =>
  tourismStyle(style)
    .map((tourism) => `'${tourism}'`)
    .join(' ')

const queryTurism = (lat: number, long: number, style: Style, radius: number) => `
SELECT * WHERE {
  VALUES ?tourism { ${tourismStyleToSparql(style)} }
  
  ?osmid osmt:name ?name .
  ?osmid osmt:tourism ?tourism .
  
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

const hostelStyleToSparql = (style: Style) =>
  hostelStyle(style)
    .map((star) => `'${star}'`)
    .join(', ')

const queryHotel = (lat: number, long: number, style: Style, radius: number) => `
SELECT * WHERE {
  VALUES ?tourism { "hotel" }
  
  ?osmid osmt:name ?name .
  ?osmid osmt:tourism ?tourism .
  
  ?osmid osmt:stars ?stars .
  FILTER ( ?stars IN (${hostelStyleToSparql(style)}) ) 

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

const query = (lat: number, long: number, style: Style, radius: number) => `${prefix}
SELECT DISTINCT * WHERE {
  {
    ${queryHotel(lat, long, style, radius)}
  } UNION {
    ${queryTurism(lat, long, style, radius)}
  }
}
ORDER BY ASC(?distance)
LIMIT 10
`

const containerId = 'accomodation'

export const getSparqlAccomodations = (
  lat: number,
  long: number,
  style: Style,
  radius: number
) =>
  getWithCache(containerId, `sophox-${lat}-${long}-${style}-${radius}`, () =>
    mySparQLQuery(query(lat, long, style, radius), sources)
  ).then(({ value }) => !('error' in value) && value)
