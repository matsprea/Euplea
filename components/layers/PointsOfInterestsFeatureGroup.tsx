import React from 'react'
import { latLng } from 'leaflet'
import { FeatureGroup, Marker, Tooltip, Circle } from 'react-leaflet'
import { PointOfInterest} from 'types'

type PointsOfInterestProps = {
  data?: PointOfInterest[]
  icon: any
  color?: string
}

export const PointsOfInterestsFeatureGroup = ({
  data = [],
  icon,
  color = 'black',
}: PointsOfInterestProps): JSX.Element => {
  return (
    <FeatureGroup>
      {data &&
        data.map(({ lat, long, label }) => {
          const dot = latLng(lat, long)
          return (
            <Circle
              key={`${lat}-${long}-Key`}
              center={dot}
              radius={10}
              fillColor={color}
              color={color}
            >
              <Marker position={dot} icon={icon}>
                <Tooltip>{label}</Tooltip>
              </Marker>
            </Circle>
          )
        })}
    </FeatureGroup>
  )
}
