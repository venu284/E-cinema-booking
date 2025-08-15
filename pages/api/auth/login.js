import passport from 'passport'
import nextConnect from 'next-connect'
import { localStrategy } from '../../../src/lib/password-local'
import { setLoginSession } from '../../../src/lib/auth'

const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })(req, res)
  })

passport.use(localStrategy)

export default nextConnect()
  .use(passport.initialize())
  .post(async (req, res) => {
    try {
      const user = await authenticate('local', req, res)
      const rememberMe = req.body.rememberMe
      const session = { ...user, rememberMe }

      await setLoginSession(res, session, rememberMe)

      res.status(200).send({ done: true })
    } catch (error) {
      console.error(error)
      res.status(401).send(error.message)
    }
  })
