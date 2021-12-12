import { IoIosRestaurant } from 'react-icons/io'
import { PointOfInterests } from './PointOfInterests'
import { useAmenityAPI } from 'hooks'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'

const AmenitiesIcon = PointOfInterestsIcon(
  'yellow',
  IoIosRestaurant,
  'square',
  'black'
)

export const Amenities = (): JSX.Element =>
  PointOfInterests({
    icon: AmenitiesIcon,
    color: 'transparent',
    useAPI: useAmenityAPI,
  })