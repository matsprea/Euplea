import { latLng } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import {
  CulturalSites,
  Itinerary,
  Amenities,
  Accomodations,
  CurrentLocation,
} from 'components/layers'
import { CurrentLocationProvider } from '../context/CurrentLocation'

type MapProps = {
  initLocation: string
  zoom: number
}

export const Map = ({ initLocation, zoom }: MapProps): JSX.Element => {
  const center = latLng(
    Number(initLocation.split(',')[0]),
    Number(initLocation.split(',')[1])
  )

  return (
    <CurrentLocationProvider>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: 'calc(100vh - 60px)', width: '100%' }}
      >
        <CurrentLocation />
        <CulturalSites />
        <Amenities />
        <Accomodations />
        <Itinerary />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </CurrentLocationProvider>
  )
}

export default Map
