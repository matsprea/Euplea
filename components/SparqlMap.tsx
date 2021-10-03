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
 
  return (
    <FeatureGroup>
      {data &&
        data.map((item: any) => (
          <Circle
            key={`${item.get('?name').value}-Key`}
            center={{
              lat: item.get('?lat').value,
              lng: item.get('?long').value,
            }}
            radius={10}
            fillColor={color}
            color={color}
          >
            <Marker
              position={{
                lat: item.get('?lat').value,
                lng: item.get('?long').value,
              }}
              icon={getLeafletIcon(icon, { color })}
            >
              <Tooltip>{item.get('?name').value}</Tooltip>
            </Marker>
          </Circle>
        ))}
    </FeatureGroup>
  )
}
