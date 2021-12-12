import { getWithCache, TTL } from 'cache'
import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
} from 'query'

const containerId = 'subject'

const query = (subject: string) => `${prefix}
SELECT DISTINCT ?sub
WHERE {
 ?cultpro rdf:type/rdfs:subClassOf* arco:CulturalProperty ;
 
 a-cd:hasSubject ?sub .

 ?sub rdfs:label ?label .
 
 FILTER(REGEX(STR(?label), "${subject}", "i")) 
 
}
`

const mapSubject = (subjects) =>
  subjects.map((subject) => subject.get('?sub').value)

const mySubjectQuery = (subject) => () =>
  mySparQLQuery(query(subject), sources).then(mapSubject)

const getSparqlSubjects = (subject: string) =>
  subject && subject.length >= 3
    ? getWithCache(
        containerId,
        `${subject}`,
        mySubjectQuery(subject),
        TTL.Month
      ).then(({ value }) => value)
    : Promise.resolve([])

export const getSubjects = getSparqlSubjects
