import connectDB from '../../../src/lib/connectDB.js'
import Movie from '../../../models/Movie.js'
import Promotion from '../../../models/Promotion.js'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchPromotion(req, res)
      break
    case 'POST':
      await createPromotion(req, res)
    case 'PUT':
      await updatePromotion(req, res)
    case 'DELETE':
      await deletePromotion(req, res)
  }
}

const searchPromotion = async (req, res) => {
  try {
    await connectDB()

    const { promotionId } = req.query

    const promotionDetails = await Promotion.findById(promotionId)

    if (promotionDetails) {
      return res
        .status(200)
        .json({ message: 'Promotion details found', promotionDetails })
    } else {
      return res
        .status(404)
        .json({ message: 'Promotion not found', promotionDetails: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const createPromotion = async (req, res) => {
  try {
    await connectDB()

    const createPromotion = new Promotion(req.body)
    await createPromotion.save()
    res.json({
      message: 'Success! Promotion Created',
      promotion: createPromotion
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updatePromotion = async (req, res) => {
  try {
    await connectDB()

    const promotion = await Promotion.findByIdAndUpdate(
      req.body._id,
      req.body,
      {
        new: true
      }
    )
    if (promotion) {
      return res.status(200).json({ message: 'Promotion Updated', promotion })
    } else {
      return res.status(200).json({ message: 'Please try again!' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deletePromotion = async (req, res) => {
  try {
    await connectDB()

    const { promotionId } = req.query

    const promotionDetails = await Promotion.findOneAndDelete({
      _id: promotionId
    })

    if (promotionDetails) {
      return res.status(200).json({ message: 'Promotion Deleted' })
    } else {
      return res.status(200).json({ message: 'Promotion not available' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
