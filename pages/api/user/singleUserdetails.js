import User from '../../../models/User.js'
import connectDB from '../../../src/lib/connectDB.js'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchUser(req, res)
      break
  }
}

const searchUser = async (req, res) => {
  try {
    await connectDB()

    const { userId } = req.query

    const userdetails = await User.findById(userId)

    if (userdetails) {
      return res
        .status(200)
        .json({ message: 'User details found', userdetails })
    } else {
      return res
        .status(404)
        .json({ message: 'User not found', userdetails: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
