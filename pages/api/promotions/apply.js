import Promotion from '../../../models/Promotion'
import connectDB from '../../../src/lib/connectDB'

export default async function handler (req, res) {
  switch (req.method) {
    case 'POST':
      await searchAllPromotions(req, res)
      break
  }
}

const searchAllPromotions = async (req, res) => {
  try {
    await connectDB()

    const { code, movieId } = req.body

    if (!code || !movieId) {
      return res
        .status(400)
        .json({ message: 'Promotion code and movie ID are required.' })
    }

    const promotion = await Promotion.findOne({
      code: code.trim().toUpperCase()
    })

    if (!promotion) {
      return res.status(404).json({ message: 'Invalid promotion code.' })
    }

    const now = new Date()

    if (
      now < promotion.promotionStartDate ||
      now > promotion.promotionEndDate
    ) {
      return res
        .status(400)
        .json({ message: 'This promotion is not currently active.' })
    }

    if (promotion.status !== 'Public') {
      return res.status(400).json({ message: 'This promotion is not active.' })
    }

    if (promotion.selectedMovies && promotion.selectedMovies.length > 0) {
      const isApplicable = promotion.selectedMovies.includes(movieId)
      if (!isApplicable) {
        return res.status(400).json({
          message: 'This promotion is not valid for the selected movie.'
        })
      }
    }

    return res.status(200).json({
      message: 'Promotion applied successfully.',
      discountRate: promotion.discountRate,
      promotionName: promotion.name
    })
  } catch (error) {
    console.error('Error applying promotion:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}
