import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
  getSites,
} from 'query'
import { getWithCache, TTL } from 'cache'

const getRegionFilter = (region: string) =>
  region.length >= 3
    ? `
 ?cultro  a-loc:hasCulturalPropertyAddress ?address .
 ?address clvapit:hasRegion ?region .
 ?region rdfs:label ?regionLabel .
 FILTER(REGEX(STR(?regionLabel), "${region}", "i")) .`
    : ''

const query = (subject: string, region: string) => `${prefix}
SELECT ?culturalInstituteOrSite (SAMPLE(?culturalInstituteOrSiteLabel) as ?culturalInstituteOrSiteLabel) (COUNT(?cultpro) AS ?count) 
WHERE {
 ?cultpro rdf:type/rdfs:subClassOf* arco:CulturalProperty ;
 a-loc:hasCulturalInstituteOrSite ?culturalInstituteOrSite ;
 a-cd:hasSubject ?subject .
  
 ?subject rdfs:label ?subjectLabel .
 FILTER(REGEX(STR(?subjectLabel), "${subject}", "i")) 

 ?culturalInstituteOrSite cis:hasSite ?site ;
 rdfs:label ?culturalInstituteOrSiteLabel .

 OPTIONAL { ?site owl:deprecated ?deprecatedSite } .
 FILTER ( !BOUND(?deprecatedSite ) ) .

 OPTIONAL { ?culturalInstituteOrSite owl:deprecated ?deprecatedC } .
 FILTER ( !BOUND(?deprecatedC) ) .

}
GROUP BY ?culturalInstituteOrSite
ORDER BY DESC(?count)
`

const containerId = 'culturalSite'

const getCulturalSites = (subject: string, region: string) =>
  getWithCache(
    containerId,
    `${subject}`,
    () => mySparQLQuery(query(subject, region), sources),
    TTL.Week
  ).then(({ value }) => value)

const culturalSiteWithoutSite = ({ site }) => site.length > 0

export const getCulturalSitesWithSites = (
  subject: string,
  region: string,
  numberOfDays: number
) =>
  subject.length >= 3 && (!region || region.length >= 3)
    ? getCulturalSites(subject, region)
        .then((culturalSites) => {
          // console.log("culturalSites", culturalSites.length)
          return Promise.all(
            culturalSites.splice(0, numberOfDays + 5).map((culturalSite) =>
              getSites(culturalSite['?culturalInstituteOrSite'].value).then(
                (site) => {
                  // console.log('site', site.length)
                  return {
                    ...culturalSite,
                    site,
                  }
                }
              )
            )
          )
        })
        .then((culturalSites) => culturalSites.filter(culturalSiteWithoutSite))
        .then((culturalSites) => culturalSites.slice(0, numberOfDays))
    : Promise.resolve([])
