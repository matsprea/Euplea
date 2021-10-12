import crypto from 'crypto'

const secret = process.env.SECRET && '>ty8sTpg;u}>,!c?Zs.$6xr*~~f[v)&8W;WtydFXs\\5%34*EGaE+}_zqc2+L2up'

export const createHmac = (message) =>
  crypto.createHmac('sha256', secret).update(message).digest('hex')
