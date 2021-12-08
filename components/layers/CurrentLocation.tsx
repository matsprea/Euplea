import { useEffect } from 'react'
import { LocationEvent } from 'leaflet'
import { useMap, Circle, Marker, Tooltip } from 'react-leaflet'
import { MdGpsFixed } from 'react-icons/md'
import { useCurrentLocation, useCulturalSites } from 'context'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'
import { useTranslation } from 'next-i18next'
import {
  sitesofCulturalSites,
  coordinatesToLatLong,
  getLatLongMinMax,
  siteToPointOfInterest,
} from 'utils'

const CurrentLocationIcon = PointOfInterestsIcon(
  'cyan',
  MdGpsFixed,
  'penta',
  'white'
)

export const CurrentLocation = (): JSX.Element => {
  const [currenteLocation, setCurrenteLocation] = useCurrentLocation()
  const { culturalSites } = useCulturalSites()
  const map = useMap()
  const { t } = useTranslation()

  useEffect(() => {
    map.locate().on('locationfound', (location: LocationEvent) => {
      setCurrenteLocation(location)
    })
  }, [])

  useEffect(() => {
    const latLongSites = sitesofCulturalSites(culturalSites)
      .map(siteToPointOfInterest)
      .map(coordinatesToLatLong)

    const latLongCoords = currenteLocation
      ? [
          [currenteLocation.latlng.lat, currenteLocation.latlng.lng],
          ...latLongSites,
        ]
      : latLongSites

    if (latLongCoords && latLongCoords.length > 0) {
      const [[maxLat, maxLong], [minLat, minLong]] =
        getLatLongMinMax(latLongCoords)

      map.fitBounds(
        [
          [maxLat + 0.1, maxLong + 0.1],
          [minLat - 0.1, minLong - 0.1],
        ],
        {
          padding: [16, 16],
        }
      )
    }
  }, [culturalSites, currenteLocation])

  return currenteLocation ? (
    <Circle
      center={currenteLocation.latlng}
      radius={currenteLocation.accuracy}
      color="transparent"
    >
      <Marker position={currenteLocation.latlng} icon={CurrentLocationIcon}>
        <Tooltip>{t('Current Position')}</Tooltip>
      </Marker>
    </Circle>
  ) : null
}
