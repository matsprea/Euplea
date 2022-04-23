import React from 'react'
import { latLng } from 'leaflet'
import { FeatureGroup, Marker, Tooltip, Circle } from 'react-leaflet'
import { PointOfInterest } from 'types'

type PointsOfInterestProps = {
  data?: PointOfInterest[]
  icon: any
  color?: string
}

const otherInfoList = (otherInfo) =>
  Object.entries(otherInfo).map(([key, value]) => (
    <li key={key}>
      ${`${key}: ${value}`}
    </li>
  ))

export const PointsOfInterestsFeatureGroup = ({
  data = [],
  icon,
  color = 'black',
}: PointsOfInterestProps): JSX.Element => {
  return (
    <FeatureGroup>
      {data &&
        data.map(({ lat, long, label, otherInfo }) => {
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
                <Tooltip>
                  <b>{label}</b>
                  {otherInfo && <ul>{otherInfoList(otherInfo)}</ul>}
                </Tooltip>
              </Marker>
            </Circle>
          )
        })}
    </FeatureGroup>
  )
}
