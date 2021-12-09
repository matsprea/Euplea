import { NextResponse, NextRequest } from 'next/server'

export const middleware = (req: NextRequest) => {
  const proto = req.headers.get('X-Forwarded-Proto')
  const host = req.headers.get('X-Forwarded-Host') ?? req.headers.get('host')
  const url = req.url

  if (proto && proto !== 'https')
    return NextResponse.redirect(`https://${host}`, 308)

  return NextResponse.next()
}
