import { LatLngExpression } from 'leaflet'
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet'
import { UserCurrentLocation } from './UserCurrentLocation'
import { Agros } from './Agros'
import { Sparql } from './Sparql'

type MapProps = {
  initLocation: LatLngExpression
}

export const Map = ({ initLocation }: MapProps): JSX.Element => (
  <MapContainer
    center={initLocation}
    zoom={8}
    scrollWheelZoom={true}
    style={{ height: 'calc(100vh - 100px)', width: '100%' }}
  >
    <UserCurrentLocation />
    <LayersControl position="topright">
      <LayersControl.Overlay name="Agriturismo">
        <Agros />
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="Gioconda">
        <Sparql />
      </LayersControl.Overlay>
    </LayersControl>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </MapContainer>
)

export default Map
