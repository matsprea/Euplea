import {
  mySparQLQuery,
  sourcesSophox as sources,
  prefixSophox as prefix,
} from 'query'
import { getWithCache } from 'cache'
import { Style } from 'types'

const amenityStyle = (style: Style) => {
  switch (style) {
    case Style.Luxury:
      return `"restaurant"`
    case Style.Medium:
      return `"restaurant" "food_court" "pub" "cafe"`
    case Style.Budget:
      return `"pub" "cafe"`
  }
}

const query = (lat: number, long: number, style: Style) => `${prefix}
SELECT * WHERE {
  VALUES ?amenity { ${amenityStyle(style)} }

  ?osmid osmt:name ?name .
  ?osmid osmt:amenity ?amenity ;
   
   SERVICE wikibase:around {
     ?osmid osmm:loc ?coordinates.
     bd:serviceParam wikibase:center "Point(${long} ${lat})"^^geo:wktLiteral.
     bd:serviceParam wikibase:radius "5". # kilometers
     bd:serviceParam wikibase:distance ?distance.
   }
}
ORDER BY ASC(?distance)
LIMIT 10
`

const containerId = 'amenity'

const getSparqlAmenities = (lat: number, long: number, style: Style) =>
  getWithCache(
    containerId,
    `${lat}-${long}-${style}`,
    mySparQLQuery(query(lat, long, style), sources)
  ).then(({ value }) => value)

export const getAmenities = (lat: number, long: number, style: Style) =>
  getSparqlAmenities(lat, long, style)