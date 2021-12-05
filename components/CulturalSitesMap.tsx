import { GiGreekTemple } from 'react-icons/gi'
import { SparqlMap } from './SparqlMap'
import { useMap } from 'react-leaflet'

export const CulturalSitesMap = ({ culturalSites }): JSX.Element => {
  const map = useMap()

  const sites = culturalSites.map((culturalSite: { site: any }) => culturalSite.site).flat()

  if (sites) {
    const latValues = sites.map((b) => parseFloat(b['?lat'].value))
    const longValues = sites.map((b) =>
      parseFloat(b['?long'].value)
    )

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

  return <SparqlMap data={sites} icon={GiGreekTemple} color="teal" />
}
