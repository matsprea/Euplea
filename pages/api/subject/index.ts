import { NextApiRequest, NextApiResponse } from 'next'
import { getSubjects } from 'query'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subject } = req.query

  if (!subject || typeof subject !== 'string')
    res.status(400).json({ error: 'Missing subject' })
  else {
    await getSubjects(subject).then((data) => res.status(200).json(data))
  }
}

export default handler
