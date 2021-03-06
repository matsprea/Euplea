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
        [userLocation.longitude, userLocation.latitude],
        ...siteCoordinatesToLongLat(sites),
      ]
    : siteCoordinatesToLongLat(sites)

export const Itinerary = (): JSX.Element => {
  const currenteLocation = useCurrentLocation()
  const [itinerary, setItinerary] = useState()
  const { culturalSites } = useCulturalSites()
  const map = useMap()

  useEffect(() => {
    const sites = sitesofCulturalSites(culturalSites)

    sites && (sites.length > 2 || (currenteLocation && sites.length > 0))
      ? osrm.trip(
          getTripConfig(coordinates(currenteLocation, sites)),
          (err, response) => {
            const [trip] = response?.trips ?? []
            if (trip) {
              const coordinates = trip.geometry.coordinates
              setItinerary(coordinates.map(([a, b]) => [b, a]))
            } else {
              setItinerary(null)
            }
          }
        )
      : setItinerary(null)
  }, [JSON.stringify(currenteLocation), JSON.stringify(culturalSites)])

  useEffect(() => {
    //@ts-expect-error leaflet-polylinedecorator override
    const decorator = L.polylineDecorator(itinerary, {
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
    })

    decorator.addTo(map)

    return () => {
      decorator.remove()
    }
  }, [itinerary])

  return itinerary ? (
    <Polyline pathOptions={{ color: 'teal' }} positions={itinerary} />
  ) : null
}
