import { NextApiRequest, NextApiResponse } from 'next'
import { getCulturalSitesWithSites } from 'query'
import { Region, ItalianRegionsMap } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subject, region, days } = req.query

  if (!subject || typeof subject !== 'string')
    res.status(400).json({ error: 'Missing subject' })
  else {
    const numberOfDays = days ? parseInt(days as string) : 2
    const myRegion = ItalianRegionsMap.get(region as Region)

    await getCulturalSitesWithSites(subject, myRegion, numberOfDays).then(
      (data) => res.status(200).json(data)
    )
  }
}

export default handler
