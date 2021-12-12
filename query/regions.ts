import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
} from 'query'
import { getWithCache } from 'cache'

const containerId = 'region'

const query = (region: string) => `${prefix}
SELECT DISTINCT ?region
WHERE {
 ?region rdf:type/rdfs:subClassOf*  clvapit:Region ;
 rdfs:label ?label .

 FILTER(REGEX(STR(?label), "${region}", "i")) 
}
`

const mapRegions = (regions) =>
  regions.map((region) => region.get('?region').value)

const myRegionsQuery = (region) => () =>
  mySparQLQuery(query(region), sources).then(mapRegions)

const getSparqlRegions = (region: string) =>
  region
    ? getWithCache(containerId, `${region}`, myRegionsQuery(region)).then(
        ({ value }) => value
      )
    : Promise.resolve([])

export const getRegions = getSparqlRegions
