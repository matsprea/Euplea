import { FaHotel } from 'react-icons/fa'
import { PointOfInterests } from './PointOfInterests'
import { useAccomodationAPI } from 'hooks'

export const Accomodations = (): JSX.Element =>
  PointOfInterests({
    icon: FaHotel,
    color: 'DeepSkyBlue',
    useAPI: useAccomodationAPI,
  })
