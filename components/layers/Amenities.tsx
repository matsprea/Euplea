import { GiGreekTemple } from 'react-icons/gi'
import { PointOfInterests } from './PointOfInterests'
import { useAmenityAPI } from 'hooks'

export const Amenities = (): JSX.Element =>
  PointOfInterests({
    icon: GiGreekTemple,
    color: 'red',
    useAPI: useAmenityAPI,
  })