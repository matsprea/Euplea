import {
  mySparQLQuery,
  sourcesSophox as sources,
  prefixSophox as prefix,
} from 'query'
import { getWithCache } from 'cache'
import { Style } from 'types'

const tourismStyle = (style: Style = Style.Medium) => {
  switch (style) {
    case Style.Luxury:
      return `""`
    case Style.Medium:
      return `"chalet" "apartment"`
    case Style.Budget:
      return `"hostel" "guest_house" "motel" "camp_site" "alpine_hut" "wilderness_hut"`
    default:
      return `""`
  }
}

const queryTurism = (lat: number, long: number, style: Style) => `
SELECT * WHERE {
  VALUES ?tourism { ${tourismStyle(style)} }
  
  ?osmid osmt:name ?name .
  ?osmid osmt:tourism ?tourism .
  
  SERVICE wikibase:around {
    ?osmid osmm:loc ?coordinates.
    bd:serviceParam wikibase:center "Point(${long} ${lat})"^^geo:wktLiteral.
    bd:serviceParam wikibase:radius "10". # kilometers
    bd:serviceParam wikibase:distance ?distance.
  }
}
ORDER BY ASC(?distance)
LIMIT 10
`

const hostelStyle = (style: Style = Style.Medium) => {
  switch (style) {
    case Style.Luxury:
      return `'4', '4S', '4.5', '5', '5S', '6'`
    case Style.Medium:
      return `'3','3S', '3.5'`
    case Style.Budget:
      return `'1','1S', '1.5','2S', '2.5'`
  }
}

const queryHotel = (lat: number, long: number, style: Style) => `
SELECT * WHERE {
  VALUES ?tourism { "hotel" }
  
  ?osmid osmt:name ?name .
  ?osmid osmt:tourism ?tourism .
  
  ?osmid osmt:stars ?stars .
  FILTER ( ?stars IN (${hostelStyle(style)}) ) 

  SERVICE wikibase:around {
    ?osmid osmm:loc ?coordinates.
    bd:serviceParam wikibase:center "Point(${long} ${lat})"^^geo:wktLiteral.
    bd:serviceParam wikibase:radius "10". # kilometers
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

const getSparqlAccomodations = (lat: number, long: number, style: Style) =>
  getWithCache(
    containerId,
    `${lat}-${long}-${style}`,
    () => mySparQLQuery(query(lat, long, style), sources)
  ).then(({ value }) => value)

export const getAccomodations = getSparqlAccomodations
