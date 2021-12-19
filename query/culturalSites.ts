import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
  getSites,
  getRegions,
} from 'query'
import { getWithCache, TTL } from 'cache'
import { Region } from 'types'
import { culturalInstituteOrSitePerDay, withCache } from 'utils'

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

const getFirstsCity = (
  culturalPropertiesByCity: Map<string, number>
): string => {
  const [city] = Array.from(culturalPropertiesByCity.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0]
  return city
}


const getCulturaSitesByCity = (
  culturalPropertiesByCity: Map<string, any[]>,
  city: string
): any[] =>
  culturalPropertiesByCity
    .get(city)
    .sort((a, b) => Number(b['?count'].value) - Number(a['?count'].value))
    .splice(0, culturalInstituteOrSitePerDay)

const getTopCulturaSites = (
  culturalSitesByCity: Map<string, any[]>,
  culturalPropertiesByCity: Map<string, number>
) => {
  const city = getFirstsCity(culturalPropertiesByCity)
  const culturaSites = getCulturaSitesByCity(culturalSitesByCity, city)

  return culturaSites
}

const getCulturalSitesId = (culturalSites: any[]): string[] =>
  culturalSites.map((site) => site['?culturalInstituteOrSite'].value)

const culturalSitesByDay = (culturalSites: any[]): any[][] => {
  if (culturalSites.length === 1) {
    return [culturalSites]
  }

  const culturalSitesByCity = new Map<string, any[]>()
  const culturalPropertiesCountByCity = new Map<string, number>()

  culturalSites.forEach((culturalSite) => {
    culturalSitesByCity.set(culturalSite['?cityLabel'].value, [
      ...(culturalSitesByCity.get(culturalSite['?cityLabel'].value) ?? []),
      culturalSite,
    ])

    culturalPropertiesCountByCity.set(
      culturalSite['?cityLabel'].value,
      (culturalPropertiesCountByCity.get(culturalSite['?cityLabel'].value) ??
        0) + Number(culturalSite['?count'].value)
    )
  })

  const topCulturaSites = getTopCulturaSites(
    culturalSitesByCity,
    culturalPropertiesCountByCity
  )

  const topCulturaSitesIDs = getCulturalSitesId(topCulturaSites)

  const otherCulturaSites = culturalSites.filter(
    (cs) => !topCulturaSitesIDs.includes(cs['?culturalInstituteOrSite'].value)
  )

  return [topCulturaSites, ...culturalSitesByDay(otherCulturaSites)]
}

const filterByNumberOfDays = (numberOfDays: number) => (culturalSites: any) =>
  culturalSitesByDay(culturalSites).slice(0, numberOfDays).flat()

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
          .then(filterByNumberOfDays(numberOfDays))
      )
    : Promise.resolve([])
