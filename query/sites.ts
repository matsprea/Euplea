import { mySparQLQuery, sourcesBeniCulturali as sources } from 'query'
import { getWithCache, TTL } from 'cache'
import { geocodeSite } from './siteGeocoding'
import {
  onlySites,
  onlyLatLong,
  query1,
  query2,
  query3,
  query4,
} from './sitesSparql'
import { Region } from 'types'

const containerId = 'site'

const withCache = true

const mySparQLQueryBeniCulturali = (query: string) =>
  mySparQLQuery(query, sources).then((response) =>
    JSON.parse(JSON.stringify(response))
  )

const siteWithoutGeocoding = (site) => !siteWithGeocoding(site)
const siteWithGeocoding = (site) => '?lat' in site && '?long' in site

const unionSiteLatLong = (sites, latLong) =>
  sites.map((site) => ({
    ...site,
    ...latLong,
  }))

const getAllSparQLSites = (culturalSite: string) =>
  Promise.all(
    [onlySites, onlyLatLong, query1, query2, query3, query4]
      .map((query) => query(culturalSite))
      .map(mySparQLQueryBeniCulturali)
  ).then(([sites, latLong, ...siteLists]) => {
    return [...siteLists.flat(), ...unionSiteLatLong(sites, latLong)].filter(
      (site) => !!site
    )
  })

const buildSitesDictionary = (siteList: any[]) => {
  const sitesDictionary = {}
  for (const site of siteList) {
    const siteId = site['?site'].value
    sitesDictionary[siteId] = [...(sitesDictionary[siteId] ?? []), site]
  }
  return Object.values(sitesDictionary)
}

const distinctSiteLatLong = (siteValues: any[]) => {
  if (siteValues.length === 0) return []

  const siteWithLatLong = siteValues.filter(siteWithGeocoding)

  const value = siteWithLatLong.length > 0 ? siteWithLatLong[0] : siteValues[0]

  return value
}

const getSparqlSiteNoCache = (culturalSite: string) =>
  getAllSparQLSites(culturalSite)
    .then(buildSitesDictionary)
    .then(distinctSiteLatLong)

const getSparqlSiteWithCache = (culturalSite: string) =>
  getWithCache(
    containerId,
    `getSparqlSiteWithCache-${culturalSite}`,
    () => getSparqlSiteNoCache(culturalSite),
    TTL.Month
  )

const getSparqlSite = withCache ? getSparqlSiteWithCache : getSparqlSiteNoCache

const getSeeAlsoSites = async (siteList: any[]) => {
  const seeAlsoList = siteList
    .filter((site) => '?siteSeeAlso' in site)
    .map((site) => site['?siteSeeAlso'].value)

  const seeAlsoSiteList = await Promise.all(
    seeAlsoList.map(getSparqlSite)
  ).then((siteLists) => siteLists.flat())

  const value = [...siteList, ...seeAlsoSiteList]

  return value
}

const removeSiteDuplicationByLatLong = (siteList: any[]) => {
  const sitesDictionary = {}
  for (const site of siteList) {
    sitesDictionary[`${site['?lat'].value}_${site['?long'].value}`] = site
  }
  return Object.values(sitesDictionary)
}

const removeSiteDuplicationBySiteLabel = (siteList: any[]) => {
  const sitesDictionary = {}
  for (const site of siteList) {
    sitesDictionary[site['?siteLabel'].value] = site
  }
  return Object.values(sitesDictionary)
}

const mapSeries = async (iterable, fn) => {
  const results = []

  for (const x of iterable) {
    results.push(await fn(x))
  }

  return results
}

const getGeocodedSites = (region: Region) => async (siteList: any[]) => {
  const sitesWithLatLong = siteList.filter(siteWithGeocoding)
  const uniqueSiteWithLatLong = removeSiteDuplicationByLatLong(sitesWithLatLong)
  const sitesWithOutLatLong = siteList.filter(siteWithoutGeocoding)

  // const sitesGeocoded = await Promise.all(
  //   sitesWithOutLatLong.map(geocodeSite(region))
  // )

  const sitesGeocoded = await mapSeries(
    sitesWithOutLatLong,
    geocodeSite(region)
  )

  const value = [...uniqueSiteWithLatLong, ...sitesGeocoded.flat()]

  return value
}

const getSitesNoCache = (culturalSite: string, region: Region) =>
  getSparqlSite(culturalSite)
    .then(getSeeAlsoSites)
    .then(getGeocodedSites(region))
    .then((sites) => sites.filter(siteWithGeocoding))
    .then(removeSiteDuplicationBySiteLabel)

const getSitesWithCache = (culturalSite: string, region: Region) =>
  getWithCache(
    containerId,
    `getSites-${culturalSite}-${region}`,
    () => getSitesNoCache(culturalSite, region),
    TTL.Month
  )

export const getSites = withCache ? getSitesWithCache : getSitesNoCache
