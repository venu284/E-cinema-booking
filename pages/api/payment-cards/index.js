import Card from '../../../models/PaymentCard'
import connectDB from '../../../src/lib/connectDB'
import { decrypt } from '../../../src/lib/cryptoUtils'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchPaymentCard(req, res)
      break
  }
}

const searchPaymentCard = async (req, res) => {
  try {
    await connectDB()
    const userId = req.query.userId

    const paymentCards = await Card.find({ user: userId }).select(
      '-createdAt -updatedAt -__v'
    )

    const decryptedCards = paymentCards.map(card => ({
      ...card._doc,
      cardNumber: decrypt(card.cardNumber),
      cvv: decrypt(card.cvv)
    }))

    res.status(200).json({ paymentCards: decryptedCards })
  } catch (error) {
    console.error('Error fetching payment cards:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}
