import connectDB from '../../../src/lib/connectDB.js'
import Movie from '../../../models/Movie.js'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchAllMovies(req, res)
      break
  }
}

const searchAllMovies = async (req, res) => {
  try {
    await connectDB()
    const details = await Movie.find({}).sort({
      $natural: -1
    })

    if (details.length > 0) {
      return res.status(200).json({ message: 'Movies Found', details })
    } else {
      return res
        .status(404)
        .json({ message: 'Movies not found', details: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
