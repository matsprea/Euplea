import {
  mySparQLQuery,
  sourcesSophox as sources,
  prefixSophox as prefix,
} from 'query'
import { getWithCache } from 'cache'
import { Style } from 'types'
import { hostelStyle, tourismStyle } from './style'

const accomodationRadius = 10 // kilometers

const tourismStyleToSparql = (style: Style) =>
  tourismStyle(style)
    .map((tourism) => `'${tourism}'`)
    .join(' ')

const queryTurism = (lat: number, long: number, style: Style) => `
SELECT * WHERE {
  VALUES ?tourism { ${tourismStyleToSparql(style)} }
  
  ?osmid osmt:name ?name .
  ?osmid osmt:tourism ?tourism .
  
  SERVICE wikibase:around {
    ?osmid osmm:loc ?coordinates.
    bd:serviceParam wikibase:center "Point(${long} ${lat})"^^geo:wktLiteral.
    bd:serviceParam wikibase:radius "${accomodationRadius}". # kilometers
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

const queryHotel = (lat: number, long: number, style: Style) => `
SELECT * WHERE {
  VALUES ?tourism { "hotel" }
  
  ?osmid osmt:name ?name .
  ?osmid osmt:tourism ?tourism .
  
  ?osmid osmt:stars ?stars .
  FILTER ( ?stars IN (${hostelStyleToSparql(style)}) ) 

  SERVICE wikibase:around {
    ?osmid osmm:loc ?coordinates.
    bd:serviceParam wikibase:center "Point(${long} ${lat})"^^geo:wktLiteral.
    bd:serviceParam wikibase:radius "${accomodationRadius}". # kilometers
    bd:serviceParam wikibase:distance ?distance.
  }
}
ORDER BY ASC(?distance)
LIMIT 10
`

const query = (lat: number, long: number, style: Style) => `${prefix}
SELECT DISTINCT * WHERE {
  {
    ${queryHotel(lat, long, style)}
  } UNION {
    ${queryTurism(lat, long, style)}
  }
}
ORDER BY ASC(?distance)
LIMIT 10
`

const containerId = 'accomodation'

export const getSparqlAccomodations = (
  lat: number,
  long: number,
  style: Style
) =>
  getWithCache(
    containerId,
    `sophox-${lat}-${long}-${style}-${accomodationRadius}`,
    () => mySparQLQuery(query(lat, long, style), sources)
  ).then(({ value }) => !('error' in value) && value)
