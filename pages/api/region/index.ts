import { NextApiRequest, NextApiResponse } from 'next'
import { getRegions } from 'query'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { region } = req.query

  if (!region || typeof region !== 'string')
    res.status(400).json({ error: 'Missing region' })
  else {
   
    await getRegions(region).then((data) =>
      res.status(200).json(data)
    )
  }
}

export default handler
