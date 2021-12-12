import nominatim from 'nominatim-client'
import { getWithCache, TTL } from 'cache'

const containerId = 'siteGeocoding'

const geocodingClient = nominatim.createClient({
  useragent: 'Euplea',
  referer: 'https://euplea.herokuapp.com',
})

const geocodingQuery = (query: nominatim.SearchOptions) => () =>
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
    geocodingQuery(getQuery(q)),
    TTL.Forever
  ).then(({ value }) => value)

export const geocodeSite = async (site) => {

  const qAddressStructured = {
    street: site['?siteFullAddress']?.value,
    city: site['?siteCityName']?.value,
    country: 'Italia',
  }

  // const qAddress = {
  //   q: `${site['?siteFullAddress']?.value}, ${site['?siteCityName']?.value}}`,
  // }

  const qName =
    site['?siteLabel']?.value === 'IRE'
      ? qAddressStructured
      : {
          q: `${site['?siteLabel']?.value}}`,
        }

  const valueAddressStructured = await getGeocoding(qAddressStructured)
  const valueName = await getGeocoding(qName)

  // const valueAddressStructured = await geocodingQuery(
  //   getQuery(qAddressStructured)
  // )()
  // const valueName = await geocodingQuery(getQuery(qName))()
 
  const [value] = [valueAddressStructured, valueName]
    .filter((v) => v && 'lat' in v)
    .sort((a, b) => b.importance - a.importance)

  const siteResult = value
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
