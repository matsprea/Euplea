import * as OSRM from 'osrm.js'
import { Polyline } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { useCulturalSites, useCurrentLocation } from 'context'
import {
  siteCoordinates,
  coordinatesToLongLat,
  sitesofCulturalSites,
} from 'utils'

const osrm = new OSRM('https://router.project-osrm.org')

const getConfig = (coordinates) => ({
  coordinates,
  annotations: ['distance', 'duration'],
  geometries: 'geojson',
  source: 'first',
  steps: true,
  overview: 'full',
})

const coordinates = (userLocation, sites) => [
  [userLocation.latlng.lng, userLocation.latlng.lat],
  ...siteCoordinates(sites).map(coordinatesToLongLat),
]

export const Itinerary = (): JSX.Element => {
  const [currenteLocation] = useCurrentLocation()
  const [itinerary, setItinerary] = useState()
  const { culturalSites } = useCulturalSites()

  if (!culturalSites) return <></>

  const sites = sitesofCulturalSites(culturalSites)

  useEffect(() => {
    currenteLocation &&
      sites &&
      sites.length >= 1 &&
      osrm.trip(
        getConfig(coordinates(currenteLocation, sites)),
        (err, response) => {
          const coordinates = response.trips[0].geometry.coordinates
          setItinerary(coordinates.map(([a, b]) => [b, a]))
        }
      )
  }, [currenteLocation, sites.length])

  return itinerary ? (
    <Polyline pathOptions={{ color: 'teal' }} positions={itinerary} />
  ) : null
}
