import { getLoginSession } from '../../../src/lib/auth'
import { findUser } from '../../../src/lib/user'

export default async function user (req, res) {
  try {
    const session = await getLoginSession(req)
    const user = (session && (await findUser(session._doc))) ?? null
    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).end('Authentication token is invalid, please log in')
  }
}
