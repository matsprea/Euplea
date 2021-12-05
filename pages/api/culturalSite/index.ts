import { NextApiRequest, NextApiResponse } from 'next'
import { getCulturalSitesWithSites } from 'utils/culturalSites'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { topic, days } = req.query

  if (!topic || typeof topic !== 'string')
    res.status(400).json({ error: 'Missing subject' })
  else {
    const numberOfDays = days ? parseInt(days as string) : 2

    await getCulturalSitesWithSites(topic, numberOfDays).then((data) =>
      res.status(200).json(data)
    )
  }
}

export default handler
