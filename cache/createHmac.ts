import crypto from 'crypto'
import { secret } from 'utils'

export const createHmac = (message) =>
  crypto.createHmac('sha256', secret).update(message).digest('hex')
