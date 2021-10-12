import { NextApiRequest, NextApiResponse } from 'next'
import { mySparQLQuery, prefix, sources } from 'utils/sparql'
import { getWithCache } from 'utils/cosmoDBCache'

const query = (subject) => `${prefix}
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { topic } = req.query

  if (!topic || typeof topic !== 'string')
    res.status(400).json({ error: 'Missing subject' })
  else
    await getWithCache(
      containerId,
      topic,
      mySparQLQuery(query(topic), sources)
    ).then((data) => res.status(200).json(data))
}

export default handler
