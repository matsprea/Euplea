import * as OSRM from 'osrm.js'
import { Polyline } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { useCurrentLocation } from 'context/currentLocation'

const osrm = new OSRM('https://router.project-osrm.org')

const getConfig = (coordinates) => ({
  coordinates,
  annotations: ['distance', 'duration'],
  geometries: 'geojson',
  source: 'first',
  steps: true,
  overview: 'full',
})

const coordinates = (userLocation, data) => [
  [userLocation.latlng.lng, userLocation.latlng.lat],
  ...data.map((d) => [Number(d['?long'].value), Number(d['?lat'].value)]),
]

export const CulturalSiteItinerary = ({ culturalSites }): JSX.Element => {
  const [currenteLocation] = useCurrentLocation()
  const [itinerary, setItinerary] = useState()

  const sites = culturalSites
    .map((culturalSite: { site: any }) => culturalSite.site)
    .flat()

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
    <Polyline pathOptions={{ color: 'blue' }} positions={itinerary} />
  ) : null
}
