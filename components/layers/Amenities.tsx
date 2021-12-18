import { IoIosRestaurant } from 'react-icons/io'
import { PointOfInterests } from './PointOfInterests'
import { useAmenityAPI } from 'hooks'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'
import { useOverpass } from 'utils'

const AmenitiesIcon = PointOfInterestsIcon(
  'yellow',
  IoIosRestaurant,
  'square',
  'black'
)

const otherInfoOverpass = (overpass) => {
  const { tags } = overpass
  const otherInfo = { ...tags }
  delete otherInfo.name
  return otherInfo
}

const otherInfoSparql = (osm) => {
  const amenity = osm['?amenity'].value

  return { amenity }
}

const otherInfo = useOverpass ? otherInfoOverpass : otherInfoSparql

export const Amenities = ({ style, radius }): JSX.Element =>
  PointOfInterests({
    icon: AmenitiesIcon,
    color: 'transparent',
    useAPI: useAmenityAPI,
    queryParams: { style, radius },
    otherInfo,
  })
