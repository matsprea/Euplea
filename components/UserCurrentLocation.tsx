import { useEffect, useState } from 'react'
import { LocationEvent } from 'leaflet'
import { useMap, Circle, Marker, Tooltip } from 'react-leaflet'
import { GiPositionMarker } from 'react-icons/gi'
import { getLeafletIcon } from './getLeafletIcon'

const userLocationZoom = 13

//https://react-leaflet.js.org/docs/core-architecture/
export const UserCurrentLocation = (): JSX.Element => {
  const [userLocation, setUserLocation] = useState<LocationEvent>()
  const map = useMap()

  useEffect(() => {
    map.locate().on('locationfound', (location: LocationEvent) => {
      setUserLocation(location)
      map.setView(location.latlng, userLocationZoom)
    })
  }, [map])

  return userLocation ? (
    <Circle
      center={userLocation.latlng}
      radius={userLocation.accuracy}
      fillColor="red"
      color="black"
    >
      <Marker
        position={userLocation.latlng}
        icon={getLeafletIcon(GiPositionMarker, { color: 'red' })}
      >
        <Tooltip>Current Position</Tooltip>
      </Marker>
    </Circle>
  ) : null
}
