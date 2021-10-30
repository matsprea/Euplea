import { NextApiRequest, NextApiResponse } from 'next'
import { getSites } from 'utils/sites'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { culturalSite } = req.query

  if (!culturalSite || typeof culturalSite !== 'string')
    res.status(400).json({ error: 'Missing culturalSite' })
  else {
    const sites = await getSites(culturalSite)

    const sitesWithLatLong = sites.filter(
      (site) => '?siteLat' in site && '?siteLong' in site
    )

    if (sitesWithLatLong.length > 0) res.status(200).json(sitesWithLatLong)
    else res.status(404).json({ error: 'No sites' })
  }
}

export default handler
