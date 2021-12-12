import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
} from 'query'
import { getWithCache, TTL } from 'cache'
import { ItalianRegionsMap, Region } from 'types'

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

const myRegionsQuery = (region: Region) => () =>
  mySparQLQuery(query(ItalianRegionsMap.get(region)), sources).then(mapRegions)

const getSparqlRegions = (region: Region) =>
  region
    ? getWithCache(
        containerId,
        `${region}3`,
        myRegionsQuery(region),
        TTL.Month
      ).then(({ value }) => value)
    : Promise.resolve([])

export const getRegions = getSparqlRegions
