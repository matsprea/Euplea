import { FaHotel } from 'react-icons/fa'
import { PointOfInterests } from './PointOfInterests'
import { useAccomodationAPI } from 'hooks'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'
import { useOverpass } from 'utils'

const AccomodationIcon = PointOfInterestsIcon('red', FaHotel, 'square', 'white')

const otherInfoOverpass = (overpass) => {
  const { tags } = overpass
  const otherInfo = { ...tags }
  delete otherInfo.name
  return otherInfo
}

const otherInfoSparql = (osm) => {
  const turism = osm['?tourism'].value

  return { turism, ...('?stars' in osm ? { stars: osm['?stars'].value } : {}) }
}

const otherInfo = useOverpass ? otherInfoOverpass : otherInfoSparql

export const Accomodations = ({ style, radius }): JSX.Element =>
  PointOfInterests({
    icon: AccomodationIcon,
    color: 'transparent',
    useAPI: useAccomodationAPI,
    queryParams: { style, radius },
    otherInfo,
  })
