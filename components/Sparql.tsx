import { LayerGroup, Marker, Tooltip } from 'react-leaflet'
import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'
import { useFetcher } from './useFetcher'
import { TiPointOfInterest } from 'react-icons/ti'
import { getLeafletIcon } from './getLeafletIcon'
import { SearchData } from '../types'

const myEngine = newEngine()

const query = (topic) => `
PREFIX arco-cd: <https://w3id.org/arco/ontology/context-description/>
PREFIX arco-arco: <https://w3id.org/arco/ontology/arco/> 
PREFIX arco-location: <https://w3id.org/arco/ontology/location/>
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>


SELECT distinct sample(?name) as ?name, count(?cultpro) as ?count, sample(?lat) as ?lat, sample(?long ) as ?long 
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

const myQuery = (topic) => myEngine.query(query( topic) , {
  sources: [{ type: 'sparql', value: 'https://dati.beniculturali.it/sparql' }],
})

const testData = (topic) => async () =>
  myQuery(topic).then((result: any) => {
    const r: IQueryResultBindings = result
    return r.bindings()
  })

  type SparqlProps =  {
 
    searchData: SearchData
  }

export const Sparql = ({ searchData }: SparqlProps): JSX.Element => {
 const  topic   = searchData?.topic;
 
  console.log('searchData ', searchData)
  const  data  = (topic && useFetcher(testData(topic)))?.data 

  return (
    <LayerGroup>
      {data &&
        data.map((item: any) => (
          <Marker
            key={`${item.get('?lat').value}-${item.get('?long').value}`}
            position={{
              lat: item.get('?lat').value,
              lng: item.get('?long').value,
            }}
            icon={getLeafletIcon(TiPointOfInterest, { color: 'teal' })}
          >
            <Tooltip>{item.get('?name').value}</Tooltip>
          </Marker>
        ))}
    </LayerGroup>
  )
}
