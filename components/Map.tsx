import { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import { UserCurrentLocation } from './UserCurrentLocation'
import { SparqlMapCulturalSite } from './SparqlMapCulturalSite'
import { SearchData } from '../types'

type MapProps = {
  initLocation: LatLngExpression
  searchData: SearchData
}

export const Map = ({ initLocation, searchData }: MapProps): JSX.Element => {

  return (
    <MapContainer
      center={initLocation}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: 'calc(100vh - 60px)', width: '100%' }}
    >
      <UserCurrentLocation />
      <SparqlMapCulturalSite searchData={searchData}   />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default Map 
