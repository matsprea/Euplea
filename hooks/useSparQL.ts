import { Bindings } from '@comunica/types'
import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'
import { useSparQLResult } from '../types'
import { useFetcher } from './useFetcher'
import { SearchData } from '../types'

const myEngine = newEngine()

const query = ({ topic }) => `
PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/>
PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/> 
PREFIX arco-location: <https://w3id.org/arco/ontology/location/>
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis:	<http://dati.beniculturali.it/cis/>

SELECT DISTINCT (sample(?name) as ?name)  (count(?cultpro) as ?count)  (sample(?lat) as ?lat)  (sample(?long ) as ?long )
FROM <https://w3id.org/arco/ontology>
FROM <https://w3id.org/arco/data>
WHERE {
 ?cultpro rdf:type/rdfs:subClassOf* arco-arco:CulturalProperty ;
 clvapit:hasGeometry ?geometry ;
 a-loc:hasCulturalInstituteOrSite ?culturalInstituteOrSite;
 arco-cd:hasSubject ?sub .

?geometry a-loc:hasCoordinates ?coordinates .

?coordinates a-loc:lat ?lat ;
a-loc:long ?long .

 ?sub rdfs:label ?label
 FILTER(REGEX(STR(?label), "${topic}", "i")) .
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

const mySparQLQuery = async (query) =>
  myEngine
    .query(query, {
      sources,
    })
    .then((result: any) => {
      const r: IQueryResultBindings = result
      return r.bindings()
    })

export const useSparQL = (searchData: SearchData): useSparQLResult => {
  const myQuery = query(searchData)

  return useFetcher<Bindings[], string>(mySparQLQuery, myQuery)
}
