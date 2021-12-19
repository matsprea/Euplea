import nominatim from 'nominatim-client'
import { getWithCache, TTL } from 'cache'
import { Region } from 'types'
import { withCache } from 'utils'

const containerId = 'siteGeocoding'
const country = 'Italia'

const geocodingClient = nominatim.createClient({
  useragent: 'Euplea',
  referer: 'https://euplea.herokuapp.com',
})

const getGeocodingWithNoCache = (query: any) =>
  geocodingClient
    .search(query)
    .then(([result]) => result ?? { query, result, date: Date.now() })

const getQuery = (q) => ({
  ...q,
  limit: 1,
})

const getGeocodingWithCache = (q: any) =>
  getWithCache(
    containerId,
    JSON.stringify(q),
    () => getGeocodingWithNoCache(getQuery(q)),
    TTL.Forever
  ).then(({ value }) => value)

const getGeocoding = withCache ? getGeocodingWithCache : getGeocodingWithNoCache

export const geocodeSite = (region: Region) => async (site) => {
  const qAddressStructured = {
    street: site['?siteFullAddress']?.value,
    city: site['?siteCityName']?.value,
    state: region,
    country,
  }

  const qName = {
    q: `${site['?siteLabel']?.value} ${
      region ? `, ${region}` : ''
    }, ${country}`,
  }

  const valueAddressStructured = await getGeocoding(qAddressStructured)
  const valueName = await getGeocoding(qName)

  // const valueAddressStructured = await geocodingQuery(
  //   getQuery(qAddressStructured)
  // )()
  // const valueName = await geocodingQuery(getQuery(qName))()

  // console.log('valueAddressStructured', valueAddressStructured)
  // console.log('valueName', valueName)

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
