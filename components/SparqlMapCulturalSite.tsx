import { TiPointOfInterest } from 'react-icons/ti'
import { SearchData } from '../types'
import { SparqlMap } from 'components/SparqlMap'
import { useSparQLCulturalSite } from '../hooks/useSparQLCulturalSite'
import { useMap } from 'react-leaflet'

type SparqlMapCulturalSiteProps = {
  searchData: SearchData
}

export const SparqlMapCulturalSite = ({
  searchData,
}: SparqlMapCulturalSiteProps): JSX.Element => {
  const map = useMap()

  const { loading, data } = useSparQLCulturalSite(searchData)

  if (data) {
    const latValues = data.map((b) => Number(b.get('?lat').value))
    const longValues = data.map((b) => Number(b.get('?long').value))

    console.log('latValues', latValues)
    console.log('longValues', longValues)

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
