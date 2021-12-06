import { latLng } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import { UserCurrentLocation } from './UserCurrentLocation'
import { CulturalSites, Itinerary, Amenities } from 'components/layers'
import { CurrentLocationProvider } from 'context'

type MapProps = {
  initLocation: string
  culturalSites: any
  zoom: number
}


export const Map = ({ initLocation, culturalSites, zoom }: MapProps): JSX.Element => {
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
        <UserCurrentLocation />
        <CulturalSites culturalSites={culturalSites} />
        <Amenities culturalSites={culturalSites} />
        <Itinerary culturalSites={culturalSites} />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </CurrentLocationProvider>
  )
}

export default Map
