import { NextApiRequest, NextApiResponse } from 'next'

type Error = {
  error: string
}

const handler = (req: NextApiRequest, res: NextApiResponse<Error>): void => {
  res.status(400).json({ error: 'Missing Topic' })
}

export default handler
