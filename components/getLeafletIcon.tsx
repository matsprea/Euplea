import L from 'leaflet'
import ReactDOMServer from 'react-dom/server'
import { IconType, IconBaseProps } from 'react-icons'

export const getLeafletIcon = (
  Icon: IconType,
  iconBaseProps?: IconBaseProps
): L.Icon => {
  const renderedIcon = ReactDOMServer.renderToString(
    <Icon {...iconBaseProps} />
  )

  const leafletIcon = L.icon({
    iconUrl: `data:image/svg+xml;utf8,${renderedIcon}`,
    iconSize: [32, 32],
    iconAnchor: [32, 64],
  })

  return leafletIcon
}
