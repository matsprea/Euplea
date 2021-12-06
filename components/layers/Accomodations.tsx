import { GiGreekTemple } from 'react-icons/gi'
import { PointOfInterests } from './PointOfInterests'
import { useAccomodationAPI } from 'hooks'

export const Accomodations = (): JSX.Element =>
  PointOfInterests({
    icon: GiGreekTemple,
    color: 'yellow',
    useAPI: useAccomodationAPI,
  })
