import { getLeafletIcon } from './getLeafletIcon'
import { IconType } from 'react-icons'
import React from 'react'
import { latLng } from 'leaflet'
import { FeatureGroup, Marker, Tooltip, Circle } from 'react-leaflet'

type SparqlMapProps = {
  data?: any[]
  icon: IconType
  color?: string
}

export const SparqlMap = ({
  data = [],
  icon,
  color = 'black',
}: SparqlMapProps): JSX.Element => {
  return (
    <FeatureGroup>
      {data &&
        data.map((item: any) => {
          const dot = latLng(
            parseFloat(item['?lat'].value),
            parseFloat(item['?long'].value)
          )
          return (
            <Circle
              key={`${item['?siteLabel'].value}-Key`}
              center={dot}
              radius={10}
              fillColor={color}
              color={color}
            >
              <Marker position={dot} icon={getLeafletIcon(icon, { color })}>
                <Tooltip>{item['?siteLabel'].value}</Tooltip>
              </Marker>
            </Circle>
          )
        })}
    </FeatureGroup>
  )
}
