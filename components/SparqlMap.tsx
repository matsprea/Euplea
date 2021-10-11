import { getLeafletIcon } from './getLeafletIcon'
import { IconType } from 'react-icons'
import React from 'react'
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
 console.log('data', data)
  return (
    <FeatureGroup>
      {data &&
        data.map((item: any) => (
          <Circle
            key={`${item['?name'].value}-Key`}
            center={{
              lat: item['?lat'].value,
              lng: item['?long'].value,
            }}
            radius={10}
            fillColor={color}
            color={color}
          >
            <Marker
              position={{
                lat: item['?lat'].value,
                lng: item['?long'].value,
              }}
              icon={getLeafletIcon(icon, { color })}
            >
              <Tooltip>{item['?name'].value}</Tooltip>
            </Marker>
          </Circle>
        ))}
    </FeatureGroup>
  )
}
