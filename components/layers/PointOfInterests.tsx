import { PointsOfInterestsFeatureGroup } from './PointsOfInterestsFeatureGroup'
import { useCulturalSites } from 'context'
import {
  coordinatesToLongLat,
  culturalSitesCoordinates,
  osmToPointOfInterest,
  overpassToPointOfInterest,
  useOverpass,
} from 'utils'

 
export const PointOfInterests = ({
  color,
  icon,
  useAPI,
  queryParams,
  otherInfo
}): JSX.Element => {
  const { culturalSites } = useCulturalSites()

  if (!culturalSites || culturalSites.length === 0) return <></>

  const coordinates =
    culturalSitesCoordinates(culturalSites).map(coordinatesToLongLat)

  const { status, data: pointOfInterests } = useAPI({
    ...queryParams,
    coordinates,
    useOverpass,
  })
  const isLoading = status === 'loading'
  if (isLoading || !pointOfInterests) return <></>

  return (
    <PointsOfInterestsFeatureGroup
      data={pointOfInterests.map(
        useOverpass
          ? overpassToPointOfInterest(otherInfo)
          : osmToPointOfInterest
      )}
      icon={icon}
      color={color}
    />
  )
}
