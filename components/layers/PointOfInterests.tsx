import { PointsOfInterestsFeatureGroup } from './PointsOfInterestsFeatureGroup'
import { useCulturalSites } from 'context'
import {
  coordinatesToLongLat,
  culturalSitesCoordinates,
  osmToPointOfInterest,
  overpassToPointOfInterest,
} from 'utils'

const overpass = parseInt(process.env.NEXT_PUBLIC_OVERPASS) === 1 ? true : false

export const PointOfInterests = ({
  color,
  icon,
  useAPI,
  queryParams,
}): JSX.Element => {
  const { culturalSites } = useCulturalSites()

  if (!culturalSites || culturalSites.length === 0) return <></>

  const coordinates =
    culturalSitesCoordinates(culturalSites).map(coordinatesToLongLat)

  const { status, data: pointOfInterests } = useAPI({
    ...queryParams,
    coordinates,
    overpass,
  })
  const isLoading = status === 'loading'
  if (isLoading || !pointOfInterests) return <></>

  return (
    <PointsOfInterestsFeatureGroup
      data={pointOfInterests.map(
        overpass ? overpassToPointOfInterest : osmToPointOfInterest
      )}
      icon={icon}
      color={color}
    />
  )
}
