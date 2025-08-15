import Card from '../../../models/PaymentCard.js'
import connectDB from '../../../src/lib/connectDB.js'
import { decrypt } from '../../../src/lib/cryptoUtils.js'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchAllCardDetails(req, res)
      break
  }
}

const searchAllCardDetails = async (req, res) => {
  try {
    await connectDB()

    const details = await Card.find({}).sort({ $natural: -1 })

    if (details.length > 0) {
      const decryptedDetails = details.map(card => ({
        ...card._doc,
        cardNumber: decrypt(card.cardNumber),
        cvv: decrypt(card.cvv)
      }))

      return res.status(200).json({
        message: 'Card Details Found',
        details: decryptedDetails
      })
    } else {
      return res.status(404).json({
        message: 'Card Details not found',
        details: undefined
      })
    }
  } catch (error) {
    console.error('Error fetching card details:', error)
    return res.status(500).json({ message: error.message })
  }
}
