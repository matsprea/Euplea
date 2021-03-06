import { PointOfInterest } from 'types'

export const siteCoordinates = (sites: any[]) => [
  ...sites.map((site) => ({
    long: Number(site['?long'].value),
    lat: Number(site['?lat'].value),
  })),
]

export const siteCoordinatesToLongLat = (sites: any[]) => [
  ...siteCoordinates(sites).map(coordinatesToLongLat),
]

export const coordinatesToLongLat = ({ long, lat }) => [long, lat]
export const coordinatesToLatLong = ({ long, lat }) => [lat, long]

export const coordinatesFromLongLat = ([long, lat]) => ({ long, lat })

export const fistSitesofCulturalSites = (culturalSites) =>
  culturalSites.map((culturalSite) => culturalSite.site[0])

export const sitesofCulturalSites = (culturalSites) =>
  culturalSites.map((culturalSite) => culturalSite.site).flat()

export const culturalSitesCoordinates = (culturalSites) =>
  siteCoordinates(fistSitesofCulturalSites(culturalSites))

export const coordinatesLongLatFromArray = (arr: string[]) => {
  const coordinatesLongLat = []
  while (arr.length) coordinatesLongLat.push(arr.splice(0, 2))

  return coordinatesLongLat
}

export const siteToPointOfInterest = (site): PointOfInterest => ({
  lat: parseFloat(site['?lat'].value),
  long: parseFloat(site['?long'].value),
  label: site['?siteLabel'].value,
  otherInfo: {
    address: site['?siteFullAddress']?.value,
    city: site['?siteCityName']?.value,
  },
})

export const osmToPointOfInterest =
  (otherInfo) =>
  (osm): PointOfInterest => {
    const regex = /^\w+\((\d+\.\d+)\s(\d+\.\d+)\)$/s
    const [, long, lat] = regex.exec(osm['?coordinates'].value)

    return {
      lat: parseFloat(lat),
      long: parseFloat(long),
      label: osm['?name'].value,
      otherInfo: otherInfo && otherInfo(osm),
    }
  }

export const overpassToPointOfInterest =
  (otherInfo) =>
  (overpass): PointOfInterest => ({
    lat: parseFloat(overpass.lat),
    long: parseFloat(overpass.lon),
    label: overpass?.tags?.name,
    otherInfo: otherInfo && otherInfo(overpass),
  })

export const getMinMax = (latValues: number[], longValues: number[]) => [
  [Math.max(...latValues), Math.max(...longValues)],
  [Math.min(...latValues), Math.min(...longValues)],
]

export const getPointOfInterestMinMax = (
  pointsOfInterests: PointOfInterest[]
) => {
  const latValues = pointsOfInterests.map((p) => p.lat)
  const longValues = pointsOfInterests.map((p) => p.long)

  return getMinMax(latValues, longValues)
}

export const getLatLongMinMax = (coordinates: number[][]) => {
  const latValues = coordinates.map(([lat]) => lat)
  const longValues = coordinates.map(([, long]) => long)

  return getMinMax(latValues, longValues)
}
