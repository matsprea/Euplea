//ts-ignore
import * as L from 'leaflet'
import 'leaflet-extra-markers'
import ReactDOMServer from 'react-dom/server'
import { IconType } from 'react-icons'

const style = {
  marginTop: '8px',
  marginLeft: '9px',
}

const renderedIcon = (Icon, iconBaseProps) =>
  ReactDOMServer.renderToString(
    <Icon size="1.5em" style={style} {...iconBaseProps} />
  )

export const PointOfInterestsIcon = (
  markerColor,
  icon: IconType,
  shape,
  iconColor = 'white'
) =>
  L.ExtraMarkers.icon({
    markerColor,
    shape,
    svg: false,
    innerHTML: renderedIcon(icon, { color: iconColor }),
  })
