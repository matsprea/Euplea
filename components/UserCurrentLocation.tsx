import { useEffect } from 'react'
import { LocationEvent } from 'leaflet'
import { useMap, Circle, Marker, Tooltip } from 'react-leaflet'
import { GiPositionMarker } from 'react-icons/gi'
import { getLeafletIcon } from './getLeafletIcon'
import { useCurrentLocation } from 'context/currentLocation'

//https://react-leaflet.js.org/docs/core-architecture/
export const UserCurrentLocation = (): JSX.Element => {
  const [currenteLocation, setCurrenteLocation] = useCurrentLocation()
  const map = useMap()

  useEffect(() => {
    map.locate().on('locationfound', (location: LocationEvent) => {
       setCurrenteLocation(location)
    })
  }, [map])

  return currenteLocation ? (
    <Circle
      center={currenteLocation.latlng}
      radius={currenteLocation.accuracy}
      fillColor="red"
      color="black"
    >
      <Marker
        position={currenteLocation.latlng}
        icon={getLeafletIcon(GiPositionMarker, { color: 'red' })}
      >
        <Tooltip>Current Position</Tooltip>
      </Marker>
    </Circle>
  ) : null
}
