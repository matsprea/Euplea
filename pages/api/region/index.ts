import { NextApiRequest, NextApiResponse } from 'next'
import { getRegions } from 'query'
import { Region } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { region } = req.query

  if (!region || typeof region !== 'string')
    res.status(400).json({ error: 'Missing region' })
  else {
    const myRegion = region as Region
    
    await getRegions(myRegion).then((data) => res.status(200).json(data))
  }
}

export default handler
