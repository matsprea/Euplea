import { PointOfInterest } from 'types'

export const siteCoordinates = (sites) => [
  ...sites.map((site) => ({
    long: Number(site['?long'].value),
    lat: Number(site['?lat'].value),
  })),
]

export const coordinatesToLongLat = ({ long, lat }) => [long, lat]

export const coordinatesFromLongLat = ([long, lat]) => ({ long, lat })

export const fistSitesofCulturalSites = (culturalSites) =>
  culturalSites.map((culturalSite) => culturalSite.site[0])

export const sitesofCulturalSites = (culturalSites) =>
  culturalSites.map((culturalSite) => culturalSite.site).flat()

export const culturalSitesCoordinates = (culturalSites) =>
  siteCoordinates(fistSitesofCulturalSites(culturalSites))

export const coordinatesLongLatFromArray = (arr) => {
  const coordinatesLongLat = []
  while (arr.length) coordinatesLongLat.push(arr.splice(0, 2))

  return coordinatesLongLat
}

export const siteToPointOfInterest = (site): PointOfInterest => ({
  lat: parseFloat(site['?lat'].value),
  long: parseFloat(site['?long'].value),
  label: site['?siteLabel'].value,
})

export const osmToPointOfInterest = (osm): PointOfInterest => {
  const regex = /^\w+\((\d+\.\d+)\s(\d+\.\d+)\)$/s
  const [ , long, lat] = regex.exec(osm['?coordinates'].value)

  return {
    lat: parseFloat(lat),
    long: parseFloat(long),
    label: osm['?name'].value,
  }
}
