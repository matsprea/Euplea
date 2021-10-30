import { NextApiRequest, NextApiResponse } from 'next'
import { getCulturalSitesWithSites } from 'utils/culturalSites'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subject } = req.query

  if (!subject || typeof subject !== 'string')
    res.status(400).json({ error: 'Missing subject' })
  else
    await getCulturalSitesWithSites(subject).then((data) =>
      res.status(200).json(data)
    )
}

export default handler
