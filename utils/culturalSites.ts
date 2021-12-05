import { mySparQLQuery, prefix, sources } from 'utils/sparql'
import { getWithCache } from 'utils/cosmoDBCache'
import { getSites } from 'utils/sites'

const query = (subject: string) => `${prefix}
SELECT ?culturalInstituteOrSite (COUNT(?cultpro) AS ?count) 
WHERE {
 ?cultpro rdf:type/rdfs:subClassOf* arco:CulturalProperty ;

 a-loc:hasCulturalInstituteOrSite ?culturalInstituteOrSite;
 a-cd:hasSubject ?sub .

 ?sub rdfs:label ?label
 FILTER(REGEX(STR(?label), "${subject}", "i")) .

 ?culturalInstituteOrSite cis:hasSite ?site .

 OPTIONAL { ?site owl:deprecated ?deprecatedSite } .
 FILTER ( !bound(?deprecatedSite ) ) .

 OPTIONAL { ?culturalInstituteOrSite owl:deprecated ?deprecatedC } .
 FILTER ( !bound(?deprecatedC) )  
}
GROUP BY ?culturalInstituteOrSite
ORDER BY DESC(?count)
`

const containerId = 'culturalSite'

const getCulturalSites = (subject: string) =>
  getWithCache(
    containerId,
    `${subject}`,
    mySparQLQuery(query(subject), sources)
  ).then(({ value }) => value)

const culturalSiteWithoutSite = ({ site }) => site.length > 0

export const getCulturalSitesWithSites = (subject: string, numberOfDays: number) =>
  getCulturalSites(subject)
    .then((culturalSites) =>
      Promise.all(
        culturalSites.map((culturalSite) =>
          getSites(culturalSite['?culturalInstituteOrSite'].value).then(
            (site) => ({
              ...culturalSite,
              site,
            })
          )
        )
      )
    )
    .then((culturalSites) => culturalSites.filter(culturalSiteWithoutSite).slice(0, numberOfDays))
