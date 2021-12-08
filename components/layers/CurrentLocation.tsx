import { useEffect } from 'react'
import { LocationEvent } from 'leaflet'
import { useMap, Circle, Marker, Tooltip } from 'react-leaflet'
import { MdGpsFixed } from 'react-icons/md'
import { useCurrentLocation } from 'context'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'
import { useTranslation } from 'next-i18next'

const CurrentLocationIcon = PointOfInterestsIcon(
  'cyan',
  MdGpsFixed,
  'penta',
  'white'
)


//https://react-leaflet.js.org/docs/core-architecture/
export const CurrentLocation = (): JSX.Element => {
  const [currenteLocation, setCurrenteLocation] = useCurrentLocation()
  const map = useMap()
  const { t } = useTranslation()

  useEffect(() => {
    map.locate().on('locationfound', (location: LocationEvent) => {
       setCurrenteLocation(location)
    })
  }, [map])

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
