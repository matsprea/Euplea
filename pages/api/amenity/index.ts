import { coordinatesLongLatFromArray } from 'utils/coordinates'
import { NextApiRequest, NextApiResponse } from 'next'
import { Style } from 'types'
import { getAmenities } from 'query'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { coordinates, style = Style.Medium } = req.query

  if (!coordinates || typeof coordinates !== 'string')
    res.status(400).json({ error: 'Missing coordinates' })
  else {
    const myStyle = style as Style

    const sites = coordinatesLongLatFromArray(coordinates.split(','))

    await Promise.all(
      sites.map(([long, lat]) =>
        getAmenities(parseFloat(lat), parseFloat(long), myStyle)
      )
    )
      .then((results) => results.flat().filter((v) => !('error' in v)))
      .then((results) => res.status(200).json(results))
  }
}

export default handler
