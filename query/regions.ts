import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
} from 'query'
import { getWithCache, TTL } from 'cache'
import { ItalianRegionsMap, Region } from 'types'
import { withCache } from 'utils'

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

const getRegionsWithNoCache = (region: Region) =>
  region
    ? mySparQLQuery(query(ItalianRegionsMap.get(region)), sources).then(
        mapRegions
      )
    : Promise.resolve([])

const getRegionsWithCache = (region: Region) =>
  getWithCache(
    containerId,
    `${region}`,
    () => getRegionsWithNoCache(region),
    TTL.Month
  ).then(({ value }) => value)

export const getRegions = withCache
  ? getRegionsWithCache
  : getRegionsWithNoCache
