import { TiPointOfInterest } from 'react-icons/ti'
import { SparqlMap } from './SparqlMap'
import { useMap } from 'react-leaflet'

export const Sparql = ({ searchData }): JSX.Element => {
  const map = useMap()

  if (searchData) {
    const latValues = searchData.map((b) => parseFloat(b['?lat'].value))
    const longValues = searchData.map((b) => parseFloat(b['?long'].value))

    if (latValues.length > 0 && latValues.length > 0)
      map.fitBounds(
        [
          [Math.max(...latValues) + 0.1, Math.max(...longValues) + 0.1],
          [Math.min(...latValues) - 0.1, Math.min(...longValues) - 0.1],
        ],
        {
          padding: [16, 16],
        }
      )
  }

  return <SparqlMap data={searchData} icon={TiPointOfInterest} />
}
