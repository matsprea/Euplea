import { coordinatesLongLatFromArray } from 'utils/coordinates'
import { NextApiRequest, NextApiResponse } from 'next'
import { Style } from 'types'
import { getSparqlAccomodations, getOverpassAccomodations } from 'query'
import { accomodationRadiusMax } from 'utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { coordinates, style = Style.Medium, overpass, radius } = req.query

  if (!coordinates || typeof coordinates !== 'string')
    res.status(400).json({ error: 'Missing coordinates' })
  else {
    const myStyle = style as Style

    const sites = coordinatesLongLatFromArray(coordinates.split(','))

    const getAccomodations =
      (overpass as string) === 'true'
        ? getOverpassAccomodations
        : getSparqlAccomodations

    const radiusFloat = parseFloat(radius as string)
    const myRadius =
      !radiusFloat || radiusFloat > accomodationRadiusMax * 2
        ? accomodationRadiusMax
        : radiusFloat

    await Promise.all(
      sites.map(([long, lat]) =>
        getAccomodations(parseFloat(lat), parseFloat(long), myStyle, myRadius)
      )
    )
      .then((results) => results.flat())
      .then((results) => res.status(200).json(results))
  }
}

export default handler
