import Review from '../../../models/Review'
import connectDB from '../../../src/lib/connectDB'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchReviews(req, res)
      break
    case 'POST':
      await createReview(req, res)
      break
  }
}

const createReview = async (req, res) => {
  try {
    await connectDB()

    const createReview = new Review(req.body)

    await createReview.save()
    res.json({
      message: 'Success! Review Created',
      review: createReview
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const searchReviews = async (req, res) => {
  try {
    await connectDB()
    const userId = req.query.userId
    const movieId = req.query.movieId

    let reviews = []

    if (userId) {
      reviews = await Review.find({ user: userId })
        .populate('user')
        .sort({ createdAt: -1 })
    } else if (movieId) {
      reviews = await Review.find({ movie: movieId })
        .populate('user')
        .sort({ createdAt: -1 })
    }

    if (reviews) {
      return res.status(200).json({ message: 'Reviews Found', reviews })
    } else {
      return res.status(404).json({ message: 'Reviews not found', reviews: [] })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
