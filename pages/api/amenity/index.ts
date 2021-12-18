import { coordinatesLongLatFromArray } from 'utils/coordinates'
import { NextApiRequest, NextApiResponse } from 'next'
import { Style } from 'types'
import { getOverpassAmenities, getSparqlAmenities } from 'query'
import { amenityRadiusMax } from 'utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    coordinates,
    style = Style.Medium,
    overpass = false,
    radius,
  } = req.query

  if (!coordinates || typeof coordinates !== 'string')
    res.status(400).json({ error: 'Missing coordinates' })
  else {
    const myStyle = style as Style

    const sites = coordinatesLongLatFromArray(coordinates.split(','))

    const getAmenities =
      (overpass as string) === 'true'
        ? getOverpassAmenities
        : getSparqlAmenities

    const radiusFloat = parseFloat(radius as string)
    const myRadius =
      !radiusFloat || radiusFloat > amenityRadiusMax * 2
        ? amenityRadiusMax
        : radiusFloat

    await Promise.all(
      sites.map(([long, lat]) =>
        getAmenities(parseFloat(lat), parseFloat(long), myStyle, myRadius)
      )
    )
      .then((results) => results.flat())
      .then((results) => res.status(200).json(results))
  }
}

export default handler
