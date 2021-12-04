import * as OSRM from 'osrm.js'
import { Polyline } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { LocationEvent } from 'leaflet'
import { useMap } from 'react-leaflet'

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

export const Itinerary = ({ data }): JSX.Element => {
  const [userLocation, setUserLocation] = useState<LocationEvent>()
  const [itinerary, setItinerary] = useState()

  const map = useMap()

  useEffect(() => {
    map.locate().on('locationfound', (location: LocationEvent) => {
      setUserLocation(location)
    })
  }, [map])

  useEffect(() => {
    userLocation &&
      data.length >= 1 &&
      osrm.trip(getConfig(coordinates(userLocation, data)), (err, response) => {
        const coordinates = response.trips[0].geometry.coordinates
        setItinerary(coordinates.map(([a, b]) => [b, a]))
      })
  }, [userLocation, data])

  return itinerary ? (
    <Polyline pathOptions={{ color: 'blue' }} positions={itinerary} />
  ) : null
}
