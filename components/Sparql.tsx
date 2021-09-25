import { LayerGroup, Marker, Tooltip } from 'react-leaflet'
import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'
import { useFetcher } from './useFetcher'
import { BiHotel } from 'react-icons/bi'
import { getLeafletIcon } from './getLeafletIcon'

const myEngine = newEngine()

const query = `
PREFIX poiapit:	<https://w3id.org/italia/onto/POI/>
PREFIX clvapit:	<https://w3id.org/italia/onto/CLV/>
PREFIX accoapit: <https://w3id.org/italia/onto/ACCO/>
SELECT DISTINCT ?label  ?comment ?asd ?lat ?long ?Geometry
WHERE {
?Accomodation a accoapit:Accomodation ;
rdfs:label ?label ;
rdfs:comment ?comment ;
poiapit:POIofficialName ?asd .
?Accomodation clvapit:hasGeometry ?Geometry .
?Geometry a clvapit:Geometry ;
clvapit:lat ?lat ;
clvapit:long ?long .
  
}
   limit 1000  offset 0  
`

const myQuery = myEngine.query(query, {
  sources: [{ type: 'sparql', value: 'https://gioconda.supsi.ch:8890/sparql' }],
})

const testData2 = async () =>
  myQuery.then((result: any) => {
    const r: IQueryResultBindings = result
    return r.bindings()
  })

export const Sparql = (): JSX.Element => {
  const { data } = useFetcher(testData2)

  return (
    <LayerGroup>
      {data &&
        data.map((item: any) => (
          <Marker
            key={item.get('?Geometry').value}
            position={{
              lat: item.get('?lat').value,
              lng: item.get('?long').value,
            }}
            icon={getLeafletIcon(BiHotel, { color: 'red' })}
          >
            <Tooltip>{item.get('?label').value}</Tooltip>
          </Marker>
        ))}
    </LayerGroup>
  )
}
