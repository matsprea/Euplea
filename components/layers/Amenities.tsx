import { IoIosRestaurant } from 'react-icons/io'
import { PointOfInterests } from './PointOfInterests'
import { useAmenityAPI } from 'hooks'

export const Amenities = (): JSX.Element =>
  PointOfInterests({
    icon: IoIosRestaurant,
    color: 'red',
    useAPI: useAmenityAPI,
  })