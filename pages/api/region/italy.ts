import { NextApiRequest, NextApiResponse } from 'next'
import { getRegions } from 'query'
import { ItalianRegionsMap } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Promise.all(Array.from(ItalianRegionsMap.values()).map(getRegions))
    .then((results) => results.flat().filter((v) => !('error' in v)))
    .then((results) => res.status(200).json(results))
}

export default handler
