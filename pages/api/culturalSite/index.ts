import { NextApiRequest, NextApiResponse } from 'next'
import { getCulturalSites } from 'utils/culturalSites'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { topic } = req.query

  if (!topic || typeof topic !== 'string')
    res.status(400).json({ error: 'Missing subject' })
  else getCulturalSites(topic).then((data) => res.status(200).json(data))
}

export default handler
