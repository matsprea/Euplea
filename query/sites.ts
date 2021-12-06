import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
} from 'query'
import { getWithCache } from 'cache'
import { geocodeSite } from './siteGeocoding'

const query = (culturalSite) => `${prefix}
SELECT (SAMPLE(?site) AS ?site) (SAMPLE(?siteSeeAlso) AS ?siteSeeAlso) (SAMPLE(?siteLabel) AS ?siteLabel) (SAMPLE(?sitePreview) AS ?sitePreview) (SAMPLE(?siteFullAddress) AS ?siteFullAddress) (SAMPLE(?siteCityName) AS ?siteCityName) ?lat ?long 
WHERE {
 ?culturalInstituteOrSite a cis:CulturalInstituteOrSite ;
 cis:hasSite ?site ;
 rdfs:label ?label .

 ?site rdfs:label ?siteLabel ;
 cis:siteAddress ?siteAddress .

 FILTER ( ?culturalInstituteOrSite = <${culturalSite}> ) .

 OPTIONAL { ?site owl:deprecated ?deprecatedSite } .
 FILTER ( !BOUND(?deprecatedSite ) ) .
 
 OPTIONAL { ?site rdfs:seeAlso ?siteSeeAlso } .
 OPTIONAL { ?site pico:preview ?sitePreview  } .

 OPTIONAL { ?siteAddress clvapit:fullAddress ?siteFullAddress } .
 OPTIONAL { ?siteAddress clvapit:hasCity ?siteCity .

  ?siteCity l0:name ?siteCityName  
 } .

 OPTIONAL { ?culturalInstituteOrSite geo:lat ?siteLat0 ;
  geo:long ?siteLong0 
 } .

 OPTIONAL { ?site a-loc:lat ?siteLat1 ;
  a-loc:long ?siteLong1 
 } .

 OPTIONAL { ?site clvapit:hasGeometry ?siteGeometry .
  ?siteGeometry a-loc:lat ?siteLat2 ;
  a-loc:long ?siteLong2 
 } .

 OPTIONAL { ?site clvapit:hasGeometry ?siteGeometry .
  ?siteGeometry a-loc:hasCoordinates ?siteCoordinates .

  ?siteCoordinates a-loc:lat ?siteLat3 ;
  a-loc:long ?siteLong3 
 } .
 
 OPTIONAL { SELECT ?siteLat4 ?siteLong4 
  WHERE { ?cultpro rdf:type/rdfs:subClassOf* arco:CulturalProperty ;
    a-loc:hasCulturalPropertyAddress ?siteAddress ;
    clvapit:hasGeometry ?cpGeometry .
    
    ?cpGeometry a-loc:hasCoordinates ?cpCoordinates .
    
    ?cpCoordinates a-loc:lat ?siteLat4 ;
    a-loc:long ?siteLong4 
  }
  LIMIT 1
 } .

 BIND(COALESCE( ?siteLat0, ?siteLat1, ?siteLat2, ?siteLat3 ) AS ?siteLat) .
 BIND(COALESCE( ?siteLong0, ?siteLong1, ?siteLong2, ?siteLong3  ) AS  ?siteLong) .
 
 BIND( ROUND( xsd:float(?siteLat)*1000000)/1000000 AS ?lat) .
 BIND( ROUND( xsd:float(?siteLong)*1000000)/1000000 AS ?long) .
}
GROUP BY ?lat ?long
`

const containerId = 'site'

const getSparQLSites = (culturalSite: string) =>
  getWithCache(
    containerId,
    culturalSite,
    mySparQLQuery(query(culturalSite), sources)
  ).then(({ value }) => value)

const siteWithoutGeocoding = (site) => !siteWithGeocoding(site)

const siteWithGeocoding = (site) => '?lat' in site && '?long' in site

const removeSiteDuplicationByLatLong = (siteList) => {
  const sitesDictionary = {}
  for (const site of siteList) {
    sitesDictionary[`${site['?lat'].value}_${site['?long'].value}`] = site
  }
  return Object.values(sitesDictionary)
}

const removeSiteDuplicationBySiteLabel = (siteList) => {
  const sitesDictionary = {}
  for (const site of siteList) {
    sitesDictionary[site['?siteLabel'].value] = site
  }
  return Object.values(sitesDictionary)
}

const getSeeAlsoSites = async (siteList: any[]) => {
  const notSeeAlsoList = siteList.filter((site) => !('?siteSeeAlso' in site))

  const seeAlsoList = await Promise.all(
    siteList
      .filter((site) => '?siteSeeAlso' in site)
      .map((site) => getSparQLSites(site['?siteSeeAlso'].value))
  )

  return [...notSeeAlsoList, ...seeAlsoList.flat()]
}

const getGeocodedSites = async (siteList: any[]) => {
  const sitesWithLatLong = siteList.filter(siteWithGeocoding)
  const uniqueSiteWithLatLong = removeSiteDuplicationByLatLong(sitesWithLatLong)

  const sitesGeocoded = await Promise.all(
    siteList.filter(siteWithoutGeocoding).map(geocodeSite)
  )

  return [...uniqueSiteWithLatLong, ...sitesGeocoded.flat()]
}

export const getSites = (culturalSite) =>
  getSparQLSites(culturalSite)
    .then(getSeeAlsoSites)
    // .then(removeSiteDuplicationBySiteLabel)
    .then(getGeocodedSites)
    .then((sites) => sites.filter(siteWithGeocoding))
