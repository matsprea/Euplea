import { useEffect } from 'react'
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
import { LatLngTuple } from 'leaflet'

const CurrentLocationIcon = PointOfInterestsIcon(
  'cyan',
  MdGpsFixed,
  'penta',
  'white'
)

export const CurrentLocation = (): JSX.Element => {
  const currenteLocation = useCurrentLocation()
  const { culturalSites } = useCulturalSites()
  const map = useMap()
  const { t } = useTranslation()

  const currentLocationLatLong: LatLngTuple = [
    currenteLocation?.latitude,
    currenteLocation?.longitude,
  ]

  useEffect(() => {
    const latLongSites = sitesofCulturalSites(culturalSites)
      .map(siteToPointOfInterest)
      .map(coordinatesToLatLong)

    const latLongCoords = currenteLocation
      ? [currentLocationLatLong, ...latLongSites]
      : latLongSites

    if (latLongCoords && latLongCoords.length > 0) {
      const [[maxLat, maxLong], [minLat, minLong]] =
        getLatLongMinMax(latLongCoords)

      map.fitBounds(
        [
          [maxLat + 0.01, maxLong + 0.01],
          [minLat - 0.01, minLong - 0.01],
        ],
        {
          padding: [6, 6],
        }
      )
    }
  }, [JSON.stringify(culturalSites), JSON.stringify(currenteLocation)])

  return currenteLocation ? (
    <Circle
      center={currentLocationLatLong}
      radius={currenteLocation.accuracy}
      color="transparent"
    >
      <Marker position={currentLocationLatLong} icon={CurrentLocationIcon}>
        <Tooltip>
          <b>{t<string>('Current Position')}</b>
          <ul>
            <li>{`${t('Latitude')}: ${currenteLocation.latitude}`}</li>
            <li>{`${t('Longitude')}: ${currenteLocation.longitude}`}</li>
            <li>{`${t('Accuracy')}: ${currenteLocation.accuracy} ${t(
              'meters'
            )}`}</li>
            {currenteLocation.altitude && (
              <li>{`${t('Altitude')}: ${currenteLocation.altitude}`}</li>
            )}
          </ul>
        </Tooltip>
      </Marker>
    </Circle>
  ) : null
}
