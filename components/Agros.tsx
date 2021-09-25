import { LayerGroup, Marker, Tooltip } from 'react-leaflet'
import { useAgro, useAgroCount } from './useAgro'
import { GiFarmTractor } from 'react-icons/gi'
import { getLeafletIcon } from './getLeafletIcon'

export const Agros = (): JSX.Element => {
  const { data: count } = useAgroCount()

  const { data } = useAgro(count, 0)

  return (
    <LayerGroup>
      {data &&
        data.map((agro) => (
          <Marker
            key={agro.id}
            position={{
              lat: agro.location.latitude,
              lng: agro.location.longitude,
            }}
            icon={getLeafletIcon(GiFarmTractor, { color: 'blue' })}
          >
            <Tooltip>{agro.nome_agriturismo}</Tooltip>
          </Marker>
        ))}
    </LayerGroup>
  )
}
