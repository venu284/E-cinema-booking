import crypto from 'crypto'
import connectDB from '../../../src/lib/connectDB'
import User from '../../../models/User'

export default async function handler (req, res) {
  switch (req.method) {
    case 'POST':
      await changePassword(req, res)
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

const changePassword = async (req, res) => {
  try {
    await connectDB()

    const { email, currentPassword, newPassword } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const currentHash = hashPassword(currentPassword, user.salt)
    if (currentHash !== user.hash) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    const newSalt = crypto.randomBytes(16).toString('hex')
    const newHash = hashPassword(newPassword, newSalt)

    user.salt = newSalt
    user.hash = newHash
    await user.save()

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
