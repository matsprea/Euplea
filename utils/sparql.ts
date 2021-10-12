import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'

const myEngine = newEngine()

export const mySparQLQuery = async (query, sources) =>
  myEngine
    .query(query, {
      sources,
    })
    .then((result: any) => {
      const r: IQueryResultBindings = result
      return r.bindings()
    })

export const sources = [
  { type: 'sparql', value: 'https://dati.beniculturali.it/sparql' },
]

export const prefix = `PREFIX a-cd: <https://w3id.org/arco/ontology/context-description/>
PREFIX arco: <https://w3id.org/arco/ontology/arco/> 
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis:	<http://dati.beniculturali.it/cis/>
PREFIX pico: <http://data.cochrane.org/ontologies/pico/>
PREFIX l0: <https://w3id.org/italia/onto/l0/>
PREFIX rdfs:	<http://www.w3.org/2000/01/rdf-schema#>
`
