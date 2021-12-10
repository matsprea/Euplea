import { NextApiRequest, NextApiResponse } from 'next'
import { getSites } from 'query'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { culturalSite } = req.query

  if (!culturalSite || typeof culturalSite !== 'string')
    res.status(400).json({ error: 'Missing culturalSite' })
  else await getSites(culturalSite).then((data) => res.status(200).json(data))
}

export default handler
