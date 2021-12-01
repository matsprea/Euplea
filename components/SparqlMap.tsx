import { getLeafletIcon } from './getLeafletIcon'
import { IconType } from 'react-icons'
import React from 'react'
import * as L from 'leaflet'
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
  // console.log(
  //   'data',
  //   data.map((d) => `${d['?lat'].value},${d['?long'].value}`).join(';')
  // )

  return (
    <FeatureGroup>
      {data &&
        data.map((item: any) => {
          const dot = L.latLng(item['?lat'].value, item['?long'].value)
          return (
            <Circle
              key={`${item['?name'].value}-Key`}
              center={dot}
              radius={10}
              fillColor={color}
              color={color}
            >
              <Marker position={dot} icon={getLeafletIcon(icon, { color })}>
                <Tooltip>{item['?name'].value}</Tooltip>
              </Marker>
            </Circle>
          )
        })}
    </FeatureGroup>
  )
}
