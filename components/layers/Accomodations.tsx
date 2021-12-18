import { FaHotel } from 'react-icons/fa'
import { PointOfInterests } from './PointOfInterests'
import { useAccomodationAPI } from 'hooks'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'

const AccomodationIcon = PointOfInterestsIcon('red', FaHotel, 'square', 'white')

export const Accomodations = ({ style, radius }): JSX.Element =>
  PointOfInterests({
    icon: AccomodationIcon,
    color: 'transparent',
    useAPI: useAccomodationAPI,
    queryParams: { style, radius },
  })
