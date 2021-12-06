import { useRouter } from 'next/router'
import { PointsOfInterestsFeatureGroup } from './PointsOfInterestsFeatureGroup'
import { useCulturalSites } from 'context'
import { Style } from 'types'
import {
  coordinatesToLongLat,
  culturalSitesCoordinates,
  osmToPointOfInterest,
} from 'utils'

export const PointOfInterests = ({ color, icon, useAPI }): JSX.Element => {
  const { query } = useRouter()
  const style = (query?.style as Style) ?? Style.Medium

  const { culturalSites } = useCulturalSites()

  if (!culturalSites || culturalSites.length === 0) return <></>

  const coordinates =
    culturalSitesCoordinates(culturalSites).map(coordinatesToLongLat)

  const { status, data: pointOfInterests } = useAPI({
    coordinates,
    style,
  })
  const isLoading = status === 'loading'
  if (isLoading || !pointOfInterests) return <></>

  return (
    <PointsOfInterestsFeatureGroup
      data={pointOfInterests.map(osmToPointOfInterest)}
      icon={icon}
      color={color}
    />
  )
}
