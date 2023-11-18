import { getWithCache, TTL } from 'cache'
import {
  mySparQLQuery,
  prefixBeniCulturali as prefix,
  sourcesBeniCulturali as sources,
} from 'query'
import { withCache } from 'utils'

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

const getSubjectsWithNoCache = (subject) =>
  subject && subject.length >= 3
    ? mySparQLQuery(query(subject), sources).then(mapSubject)
    : Promise.resolve([])

const getSubjectsWithCache = (subject: string) =>
  getWithCache(
    containerId,
    `${subject}`,
    () => getSubjectsWithNoCache(subject),
    TTL.Month
  ) 

export const getSubjects = withCache
  ? getSubjectsWithCache
  : getSubjectsWithNoCache
