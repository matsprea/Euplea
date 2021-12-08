import { GiGreekTemple } from 'react-icons/gi'
import { PointsOfInterestsFeatureGroup } from './PointsOfInterestsFeatureGroup'
import { useMap } from 'react-leaflet'
import { useCulturalSites } from 'context'
import { siteToPointOfInterest } from 'utils'
import { PointOfInterestsIcon } from './PointOfInterestsIcon'

const CulturalSiteIcon = PointOfInterestsIcon(
  'green-dark',
  GiGreekTemple,
  'star',
  'white'
)

export const CulturalSites = (): JSX.Element => {
  const map = useMap()
  const { culturalSites } = useCulturalSites()

  if (!culturalSites) return <></>
  
  const sites = culturalSites
    .map((culturalSite: { site: any }) => culturalSite.site)
    .flat()
    

  if (sites) {
    const latValues = sites.map((b) => parseFloat(b['?lat'].value))
    const longValues = sites.map((b) => parseFloat(b['?long'].value))

    if (latValues.length > 0 && latValues.length > 0)
      map.fitBounds(
        [
          [Math.max(...latValues) + 0.1, Math.max(...longValues) + 0.1],
          [Math.min(...latValues) - 0.1, Math.min(...longValues) - 0.1],
        ],
        {
          padding: [16, 16],
        }
      )
  }

  return (
    <PointsOfInterestsFeatureGroup
      data={sites.map(siteToPointOfInterest)}
      icon={CulturalSiteIcon}
      color="transparent"
    />
  )
}
