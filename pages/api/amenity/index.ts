import { NextApiRequest, NextApiResponse } from 'next'
import { Style } from 'types'
import { getAmenities } from 'query'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { lat , long, style = Style.Medium } = req.query

  if (!lat || !long || typeof lat !== 'string' || typeof long !== 'string')
    res.status(400).json({ error: 'Missing coordinates' })
  else {
    const myStyle = style as Style
    const myLat = parseFloat(lat)
    const myLong = parseFloat(long)

    await getAmenities(myLat, myLong, myStyle).then((data) =>
      res.status(200).json(data)
    )
  }
}

export default handler
