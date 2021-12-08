import { GiGreekTemple } from 'react-icons/gi'
import { PointsOfInterestsFeatureGroup } from './PointsOfInterestsFeatureGroup'
import { useCulturalSites } from 'context'
import { siteToPointOfInterest, sitesofCulturalSites } from 'utils'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'

const CulturalSiteIcon = PointOfInterestsIcon(
  'green-dark',
  GiGreekTemple,
  'star',
  'white'
)

export const CulturalSites = (): JSX.Element => {
  const { culturalSites } = useCulturalSites()
  
  if (!culturalSites) return <></>

  const sites = sitesofCulturalSites(culturalSites).map(siteToPointOfInterest)

  return (
    <PointsOfInterestsFeatureGroup
      data={sites}
      icon={CulturalSiteIcon}
      color="transparent"
    />
  )
}
