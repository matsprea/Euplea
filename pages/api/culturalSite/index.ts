import { NextApiRequest, NextApiResponse } from 'next'
import { getCulturalSitesWithSites } from 'query'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subject, region, days } = req.query

  if (!subject || typeof subject !== 'string')
    res.status(400).json({ error: 'Missing subject' })
  else {
    const numberOfDays = days ? parseInt(days as string) : 2

    await getCulturalSitesWithSites(subject, `${region}`, numberOfDays).then(
      (data) => res.status(200).json(data)
    )
  }
}

export default handler
