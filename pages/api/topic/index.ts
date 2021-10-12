import { NextApiRequest, NextApiResponse } from 'next'
import { mySparQLQuery } from 'utils/sparql'
import { getWithCache } from 'utils/cosmoDBCache'

const prefix = `PREFIX a-cd: <https://w3id.org/arco/ontology/context-description/>
PREFIX arco: <https://w3id.org/arco/ontology/arco/> 
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis:	<http://dati.beniculturali.it/cis/>
`

const query = (subject) => `${prefix}
SELECT DISTINCT (sample(?name) as ?name)  (count(?cultpro) as ?count)  (sample(?lat) as ?lat)  (sample(?long ) as ?long )
FROM <https://w3id.org/arco/ontology>
FROM <https://w3id.org/arco/data>
WHERE {
 ?cultpro rdf:type/rdfs:subClassOf* arco:CulturalProperty ;
 clvapit:hasGeometry ?geometry ;
 a-loc:hasCulturalInstituteOrSite ?culturalInstituteOrSite;
 a-cd:hasSubject ?sub .

?geometry a-loc:hasCoordinates ?coordinates .

?coordinates a-loc:lat ?lat ;
a-loc:long ?long .

 ?sub rdfs:label ?label
 FILTER(REGEX(STR(?label), "${subject}", "i")) .
 ?culturalInstituteOrSite cis:hasSite ?site ;
 rdfs:label ?name .
OPTIONAL { ?site owl:deprecated ?deprecated } .
   FILTER ( !bound(?deprecated) )  
 
} 
GROUP BY ?site
order by DESC(?count) 
limit 10
`

const sources = [
  { type: 'sparql', value: 'https://dati.beniculturali.it/sparql' },
]

const containerId = 'topic'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { topic } = req.query

  if (!topic || typeof topic !== 'string')
    res.status(400).json({ error: 'Missing Topic' })
  else
    await getWithCache(
      containerId,
      topic,
      mySparQLQuery(query(topic), sources)
    ).then((data) => {
      res.status(200).json(data)
    })
}

export default handler