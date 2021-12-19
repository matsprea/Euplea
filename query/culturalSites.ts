import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
  getSites,
  getRegions,
} from 'query'
import { getWithCache, TTL } from 'cache'
import { Region } from 'types'
import { withCache } from 'utils'

const getRegionFilter = (regionIds: string[]) =>
  regionIds.length > 0
    ? `

 ?address clvapit:hasRegion ?region .

 FILTER( ?region IN ( ${regionIds
   .map((region) => `<${region}>`)
   .join(', ')})) .`
    : ''

const query = (subject: string, regionIds: string[]) => `${prefix}
SELECT ?culturalInstituteOrSite (SAMPLE(?culturalInstituteOrSiteLabel) as ?culturalInstituteOrSiteLabel) (COUNT( DISTINCT ?cultpro) AS ?count) (SAMPLE(?cityLabel) as ?cityLabel)
WHERE {
 ?cultpro rdf:type/rdfs:subClassOf* arco:CulturalProperty ;
 a-loc:hasCulturalInstituteOrSite ?culturalInstituteOrSite ;
 a-loc:hasCulturalPropertyAddress ?address ;
 a-cd:hasSubject ?subject .
 
 ?address clvapit:hasCity ?city .
 ?city rdfs:label ?cityLabel .
  
 ?subject rdfs:label ?subjectLabel .
 FILTER(REGEX(STR(?subjectLabel), "${subject}", "i")) 

 ?culturalInstituteOrSite rdfs:label ?culturalInstituteOrSiteLabel .

 ${getRegionFilter(regionIds)}
 
}
GROUP BY ?culturalInstituteOrSite
ORDER BY DESC(?count)
`

const containerId = 'culturalSite'

const getCulturalSitesWithNoCache = (subject, regionIds) =>
  mySparQLQuery(query(subject, regionIds), sources)

const getCulturalSitesWithCache = (subject: string, regionIds: string[]) =>
  getWithCache(
    containerId,
    `${subject}-${regionIds}`,
    () => getCulturalSitesWithNoCache(subject, regionIds),
    TTL.Week
  ).then(({ value }) => value)

const getCulturalSites = withCache
  ? getCulturalSitesWithCache
  : getCulturalSitesWithNoCache

const culturalSiteWithoutSite = ({ site }) => site.length > 0

export const getCulturalSitesWithSites = (
  subject: string,
  region: Region,
  numberOfDays: number
) =>
  subject.length >= 3
    ? getRegions(region).then((regionIds) =>
        getCulturalSites(subject, regionIds)
          .then((culturalSites) =>
            Promise.all(
              // culturalSites.splice(0, numberOfDays + 5).map((culturalSite) =>
              culturalSites.map((culturalSite) =>
                getSites(
                  culturalSite['?culturalInstituteOrSite'].value,
                  region
                ).then((site) => ({
                  ...culturalSite,
                  site,
                }))
              )
            )
          )
          .then((culturalSites) =>
            culturalSites.filter(culturalSiteWithoutSite)
          )
          .then((culturalSites) => culturalSites.slice(0, numberOfDays))
      )
    : Promise.resolve([])
