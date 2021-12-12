import { NextApiRequest, NextApiResponse } from 'next'
import { getSites } from 'query'
import { Region } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { culturalSite, region } = req.query

  const myRegion = region as Region

  if (!culturalSite || typeof culturalSite !== 'string')
    res.status(400).json({ error: 'Missing culturalSite' })
  else await getSites(culturalSite, myRegion).then((data) => res.status(200).json(data))
}

export default handler
