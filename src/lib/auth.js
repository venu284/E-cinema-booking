import Iron from '@hapi/iron'
import { setTokenCookie, getTokenCookie } from './auth-cookies'

const TOKEN_SECRET = process.env.TOKEN_SECRET

const SHORT_SESSION_AGE = 60 * 60 * 24
const LONG_SESSION_AGE = 60 * 60 * 24 * 30

export async function setLoginSession (res, session, rememberMe) {
  const createdAt = Date.now()
  const maxAge = rememberMe ? LONG_SESSION_AGE : SHORT_SESSION_AGE

  const obj = { ...session, createdAt, maxAge }
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults)

  setTokenCookie(res, token, maxAge)
}

export async function getLoginSession (req) {
  const token = getTokenCookie(req)

  if (!token) return

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    return null
  }

  return session
}
