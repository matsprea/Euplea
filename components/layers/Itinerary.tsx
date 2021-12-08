import * as OSRM from 'osrm.js'
import * as L from 'leaflet'
import { Polyline, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet-polylinedecorator'
import { useCulturalSites, useCurrentLocation } from 'context'
import { siteCoordinatesToLongLat, sitesofCulturalSites } from 'utils'

const osrm = new OSRM('https://router.project-osrm.org')

const getTripConfig = (coordinates) => ({
  coordinates,
  annotations: ['distance', 'duration'],
  geometries: 'geojson',
  source: 'first',
  steps: true,
  overview: 'full',
})

const coordinates = (userLocation, sites) =>
  userLocation
    ? [
        [userLocation.latlng.lng, userLocation.latlng.lat],
        ...siteCoordinatesToLongLat(sites),
      ]
    : siteCoordinatesToLongLat(sites)

export const Itinerary = (): JSX.Element => {
  const [currenteLocation] = useCurrentLocation()
  const [itinerary, setItinerary] = useState()
  const { culturalSites } = useCulturalSites()
  const map = useMap()

  if (!culturalSites) return <></>

  const sites = sitesofCulturalSites(culturalSites)

  useEffect(() => {
    sites &&
      sites.length >= 1 &&
      osrm.trip(
        getTripConfig(coordinates(currenteLocation, sites)),
        (err, response) => {
          const [trip] = response?.trips ?? []
          if (trip) {
            const coordinates = trip.geometry.coordinates
            setItinerary(coordinates.map(([a, b]) => [b, a]))
          }
          else {
            setItinerary(null) 
          }
        }
      )
  }, [currenteLocation, JSON.stringify(sites)])

  useEffect(() => {
    //@ts-expect-error leaflet-polylinedecorator override
    L.polylineDecorator(itinerary, {
      patterns: [
        {
          offset: 25,
          repeat: 50,
          //@ts-expect-error leaflet-polylinedecorator override
          symbol: L.Symbol.arrowHead({
            pixelSize: 15,
            pathOptions: { fillOpacity: 1, weight: 0, color: '#4299e199' },
          }),
        },
      ],
    }).addTo(map)
  }, [itinerary])

  return itinerary ? (
    <Polyline pathOptions={{ color: 'teal' }} positions={itinerary} />
  ) : null
}
