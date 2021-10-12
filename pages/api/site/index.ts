import { NextApiRequest, NextApiResponse } from 'next'
import { mySparQLQuery, prefix, sources } from 'utils/sparql'
import { getWithCache } from 'utils/cosmoDBCache'
import nominatim from 'nominatim-client'

const query = (culturalSite) => `${prefix}
SELECT ?site (SAMPLE(?siteSeeAlso) AS ?siteSeeAlso) (SAMPLE(?siteName) AS ?siteName) (SAMPLE(?sitePreview) AS ?sitePreview) (SAMPLE(?siteFullAddress) AS ?siteFullAddress) (SAMPLE(?siteCityName) AS ?siteCityName) (SAMPLE(?siteLat ) AS ?siteLat) (SAMPLE(?siteLong ) AS ?siteLong)
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
 }  .

 BIND(COALESCE( ?siteLat0, ?siteLat1, ?siteLat2, ?siteLat3 ) AS ?siteLat) .
 BIND(COALESCE( ?siteLong0, ?siteLong1, ?siteLong2, ?siteLong3 ) AS  ?siteLong) 
}

GROUP BY ?site
`

const containerId = 'site'

const getSites = (culturalSite: string) =>
  getWithCache(
    containerId,
    culturalSite,
    mySparQLQuery(query(culturalSite), sources)
  ).then(({ value }) => value)

const getSeeAlsoSites = async (siteList: any[]) => {
  const notSeeAlsoList = siteList.filter((site) => !('?siteSeeAlso' in site))

  const seeAlsoList = await Promise.all(
    siteList
      .filter((site) => '?siteSeeAlso' in site)
      .map((site) => getSites(site['?siteSeeAlso'].value))
  )

  return [...notSeeAlsoList, ...seeAlsoList.flat()]
}

const geocodingClient = nominatim.createClient({
  useragent: 'Euplea',
  referer: 'https://euplea.vercel.app/',
})

const geocodeSite = (site) => {
  const q = `${site['?siteFullAddress'].value}, ${site['?siteCityName'].value}`
  const query = {
    q,
    limit: 1,
  }

  const geocodingQuery = geocodingClient.search(query).then((result) => ({
    ...site,
    '?siteLat': {
      termType: 'Literal',
      value: result[0].lat,
      language: '',
      datatype: {
        termType: 'NamedNode',
        value: 'http://www.w3.org/2001/XMLSchema#string',
      },
    },
    '?siteLong': {
      termType: 'Literal',
      value: result[0].lon,
      language: '',
      datatype: {
        termType: 'NamedNode',
        value: 'http://www.w3.org/2001/XMLSchema#string',
      },
    },
  }))

  return getWithCache(containerId, q, geocodingQuery).then(({ value }) => value)
}

const getGeocodedSites = async (siteList: any[]) => {
  const sitesWithLatLong = siteList.filter(
    (site) => '?siteLat' in site && '?siteLong' in site
  )

  const sitesGeocoded = await Promise.all(
    siteList
      .filter((site) => !('?siteLat' in site && '?siteLong' in site))
      .map(geocodeSite)
  )

  return [...sitesWithLatLong, ...sitesGeocoded.flat()]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { culturalSite } = req.query

  if (!culturalSite || typeof culturalSite !== 'string')
    res.status(400).json({ error: 'Missing culturalSite' })
  else {
    const sites = await getSites(culturalSite)
      .then(getSeeAlsoSites)
      .then(getGeocodedSites)

    const sitesWithLatLong = sites.filter(
      (site) => '?siteLat' in site && '?siteLong' in site
    )
 
    if (sitesWithLatLong.length > 0) res.status(200).json(sitesWithLatLong)
    else
      res.status(404).json({ error: 'No sites with coordinates', data: sites })
  }
}

export default handler
