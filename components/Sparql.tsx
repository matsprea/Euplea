import { TiPointOfInterest } from 'react-icons/ti'
 import { SparqlMap } from './SparqlMap'
 
import { useSparQL } from '../hooks/useSparQL'
import { SearchData } from 'types'
import { useMap } from 'react-leaflet'

 type SparqlProps = {
   searchData: SearchData
 }

export const Sparql = ({ searchData }: SparqlProps): JSX.Element => {
  const { data } = useSparQL(searchData)
  const map = useMap()

    if (data) {
      const latValues = data.map((b) => Number(b.get('?lat').value))
      const longValues = data.map((b) => Number(b.get('?long').value))

      // console.log('latValues', latValues)
      // console.log('longValues', longValues)

      if (latValues.length > 0 && latValues.length > 0)
        map.fitBounds(
          [
            [Math.max(...latValues), Math.max(...longValues)],
            [Math.min(...latValues), Math.min(...longValues)],
          ],
          {
            padding: [16, 16],
          }
        )
    }
    
  return data && <SparqlMap data={data} icon={TiPointOfInterest} />
}
