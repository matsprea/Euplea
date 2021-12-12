import { NextApiRequest, NextApiResponse } from 'next'
import { getRegions } from 'query'

const italianRegionNames = [
  '^Abruzzo',
  '^Basilicata',
  '^Calabria',
  '^Campania',
  '^Emilia.*(Romagna)?',
  '^Friuli.*(Venezia.*Giulia)?',
  '^Lazio',
  '^Liguria',
  '^Lombardia',
  '^Marche',
  '^Molise',
  '^Piemonte',
  '^Puglia',
  '^Sardegna',
  '^Sicilia',
  '^Toscana',
  '^Trentino.*(Alto.*Adige)?',
  '^Umbria',
  '^Val(le)?.*Aosta',
  '^Veneto',
]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Promise.all(italianRegionNames.map((region) => getRegions(region)))
    .then((results) => results.flat().filter((v) => !('error' in v)))
    .then((results) => res.status(200).json(results))
}

export default handler
