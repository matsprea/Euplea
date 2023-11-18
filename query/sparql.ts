import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'

const myEngine = newEngine()

export const mySparQLQuery = (query: string, sources) =>
  myEngine
    .query(query, {
      sources,
    })
    .then((result: any) => {
      const r: IQueryResultBindings = result
      return r.bindings()
    })
    .catch((error: any) => {
      console.error(`Error: mySparQLQuery ${error}`)
      throw error
    })

export const sourcesBeniCulturali = [
  {
    type: 'sparql',
    value: 'https://dati.beniculturali.it/sparql',
  },
]

export const sourcesSophox = [
  {
    type: 'sparql',
    value: 'https://sophox.org/sparql',
  },
]

export const prefixBeniCulturali = `PREFIX a-cd: <https://w3id.org/arco/ontology/context-description/>
PREFIX arco: <https://w3id.org/arco/ontology/arco/> 
PREFIX clvapit: <https://w3id.org/italia/onto/CLV/>
PREFIX a-loc: <https://w3id.org/arco/ontology/location/>
PREFIX cis:	<http://dati.beniculturali.it/cis/>
PREFIX pico: <http://data.cochrane.org/ontologies/pico/>
PREFIX l0: <https://w3id.org/italia/onto/l0/>
PREFIX rdfs:	<http://www.w3.org/2000/01/rdf-schema#>
`

export const prefixSophox = `PREFIX osmm: <https://www.openstreetmap.org/meta/>
 PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:>

 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
 PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
 PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>
 PREFIX dct: <http://purl.org/dc/terms/>
 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
 PREFIX owl: <http://www.w3.org/2002/07/owl#>
 PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
 PREFIX schema: <http://schema.org/>
 PREFIX cc: <http://creativecommons.org/ns#>
 PREFIX geo: <http://www.opengis.net/ont/geosparql#>
 PREFIX prov: <http://www.w3.org/ns/prov#>
 PREFIX wikibase: <http://wikiba.se/ontology#>
 PREFIX wdata: <http://www.wikidata.org/wiki/Special:EntityData/>
 PREFIX bd: <http://www.bigdata.com/rdf#>
 
 PREFIX wd: <http://www.wikidata.org/entity/>
 PREFIX wdt: <http://www.wikidata.org/prop/direct/>
 PREFIX wdtn: <http://www.wikidata.org/prop/direct-normalized/>
 
 PREFIX wds: <http://www.wikidata.org/entity/statement/>
 PREFIX p: <http://www.wikidata.org/prop/>
 PREFIX wdref: <http://www.wikidata.org/reference/>
 PREFIX wdv: <http://www.wikidata.org/value/>
 PREFIX ps: <http://www.wikidata.org/prop/statement/>
 PREFIX psv: <http://www.wikidata.org/prop/statement/value/>
 PREFIX psn: <http://www.wikidata.org/prop/statement/value-normalized/>
 PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
 PREFIX pqv: <http://www.wikidata.org/prop/qualifier/value/>
 PREFIX pqn: <http://www.wikidata.org/prop/qualifier/value-normalized/>
 PREFIX pr: <http://www.wikidata.org/prop/reference/>
 PREFIX prv: <http://www.wikidata.org/prop/reference/value/>
 PREFIX prn: <http://www.wikidata.org/prop/reference/value-normalized/>
 PREFIX wdno: <http://www.wikidata.org/prop/novalue/>

 PREFIX hint: <http://www.bigdata.com/queryHints#>
`
