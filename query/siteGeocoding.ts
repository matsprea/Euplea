import nominatim from 'nominatim-client'
import { getWithCache } from 'cache'

const containerId = 'siteGeocoding'

const geocodingClient = nominatim.createClient({
  useragent: 'Euplea',
  referer: 'https://euplea.herokuapp.com',
})

const geocodingQuery = (query) => () =>
  geocodingClient
    .search(query)
    .then(([result]) => result ?? { query, result, date: Date.now() })

const getQuery = (q) => ({
  ...q,
  limit: 1,
})

const getGeocoding = (q) =>
  getWithCache(
    containerId,
    JSON.stringify(q),
    geocodingQuery(getQuery(q))
  ).then(({ value }) => value)

export const geocodeSite = async (site) => {
  const qAddress = {
    street: site['?siteFullAddress']?.value,
    city: site['?siteCityName']?.value,
  }
  const qName = { q: site['?siteLabel']?.value }

  const valueAddress = await getGeocoding(qAddress)
  const value = valueAddress?.lat ? valueAddress : await getGeocoding(qName)

  const siteResult = ('lat' in value)
    ? {
        ...site,
        '?lat': {
          termType: 'Literal',
          value: value.lat,
          language: '',
          datatype: {
            termType: 'NamedNode',
            value: 'http://www.w3.org/2001/XMLSchema#string',
          },
        },
        '?long': {
          termType: 'Literal',
          value: value.lon,
          language: '',
          datatype: {
            termType: 'NamedNode',
            value: 'http://www.w3.org/2001/XMLSchema#string',
          },
        },
      }
    : site

  return siteResult
}
