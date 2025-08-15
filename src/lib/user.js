import crypto from 'crypto'
import User from '../../models/User'
import connectDB from './connectDB'

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

export async function createUser ({
  username,
  password,
  firstName,
  lastName,
  phone,
  promotions
}) {
  await connectDB()
  const oldEntry = await User.findOne({ email: username })
  if (oldEntry) {
    throw new Error('User Already Exists, Please Log in.')
  }
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  const user = new User({
    email: username,
    hash,
    salt,
    category: 'user',
    promotions,
    firstName,
    lastName,
    phone
  })
  await user.save()
  return { username, createdAt: Date.now() }
}

// Here you should lookup for the user in your DB
export async function findUser ({ email }) {
  // This is an in memory store for users, there is no data persistence without a proper DB
  try {
    await connectDB()
    const data = await User.findOne({ email })
    return data
  } catch (e) {
    return null
  }
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export function validatePassword (user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')
  const passwordsMatch = user.hash === inputHash
  return passwordsMatch
}
