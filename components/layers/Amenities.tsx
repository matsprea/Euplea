import { useRouter } from 'next/router'
import { GiGreekTemple } from 'react-icons/gi'
import { SparqlMap } from 'components/SparqlMap'
import { useCulturalSites } from 'context'
import { Style } from 'types'

const sitesFromCulturaSites = (culturalSites) => [...culturalSites.map((d) => d['?site'].value)]


export const Amenities = (): JSX.Element => {
  const { query } = useRouter()
  const style = (query?.style as Style) ?? Style.Medium

    
  const { culturalSites } = useCulturalSites()

  if (!culturalSites) return <></>
    
  const sites = culturalSites
    .map((culturalSite: { site: any }) => culturalSite.site)
    .flat()

 
  return null
  //  <SparqlMap data={sites} icon={GiGreekTemple} color="teal" />
}
