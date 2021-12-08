import { latLng } from 'leaflet'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import {
  CulturalSites,
  Itinerary,
  Amenities,
  Accomodations,
  CurrentLocation,
} from 'components/layers'
import { CurrentLocationProvider } from '../context/CurrentLocation'
import { useTranslation } from 'next-i18next'

type MapProps = {
  initLocation: string
  zoom: number
  height: string
}

export const Map = ({ initLocation, zoom, height }: MapProps): JSX.Element => {
  const { t } = useTranslation()

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
        style={{ height, width: '100%' }}
      >
        <CurrentLocation />
        <CulturalSites />
        <Itinerary />

        <LayersControl position="topleft">
          <LayersControl.Overlay name={t('Amenities')} checked>
            <Amenities />
          </LayersControl.Overlay>
          <LayersControl.Overlay name={t('Accomodations')} checked>
            <Accomodations />
          </LayersControl.Overlay>
        </LayersControl>

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </CurrentLocationProvider>
  )
}

export default Map
