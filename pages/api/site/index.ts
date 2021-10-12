import { NextApiRequest, NextApiResponse } from 'next'
import { mySparQLQuery } from 'utils/sparql'
import { getWithCache } from 'utils/cosmoDBCache'

const prefix = `PREFIX a-cd: <https://w3id.org/arco/ontology/context-description/>
PREFIX arco: <https://w3id.org/arco/ontology/arco/> 
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis:	<http://dati.beniculturali.it/cis/>
PREFIX pico: <http://data.cochrane.org/ontologies/pico/>
`

const query = (culturalSite) => `${prefix}
SELECT SAMPLE(?siteName) AS ?siteName,  SAMPLE(?sitePreview) AS ?sitePreview,  SAMPLE(?siteFullAddress) AS ?siteFullAddress, SAMPLE(?siteCityName) AS ?siteCityName
, SAMPLE(?siteLat ) AS ?siteLat , SAMPLE(?siteLong ) AS ?siteLong 
WHERE {
 ?culturalInstituteOrSite a cis:CulturalInstituteOrSite ;
 cis:hasSite ?site ;
 rdfs:label ?label ;
 l0:name ?name .

 ?site rdfs:label ?siteLabel ;
 cis:siteAddress ?siteAddress ;
 l0:name ?siteName .

 FILTER ( ?culturalInstituteOrSite = <${culturalSite}> ) .

 OPTIONAL { ?site owl:deprecated ?deprecatedSite } .
 FILTER ( !bound(?deprecatedSite ) ) .

 OPTIONAL { ?site pico:preview ?sitePreview  } .

 OPTIONAL { ?siteAddress clvapit:fullAddress ?siteFullAddress } .
 OPTIONAL { ?siteAddress clvapit:hasCity ?siteCity .

  ?siteCity l0:name ?siteCityName .
  } .
 
 OPTIONAL { ?site clvapit:hasGeometry ?siteGeometry . 
  ?siteGeometry a-loc:hasCoordinates ?siteCoordinates .

  ?siteCoordinates a-loc:lat ?siteLat ;
  a-loc:long ?siteLong .
  } .

}
GROUP BY ?site
`

const sources = [
  { type: 'sparql', value: 'https://dati.beniculturali.it/sparql' },
]

const containerId = 'site'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { culturalSite } = req.query

  if (!culturalSite || typeof culturalSite !== 'string')
    res.status(400).json({ error: 'Missing culturalSite' })
  else
    await getWithCache(
      containerId,
      culturalSite,
      mySparQLQuery(query(culturalSite), sources)
    ).then((data) => res.status(200).json(data))
}

export default handler
