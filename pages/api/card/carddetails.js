import Card from '../../../models/PaymentCard'
import connectDB from '../../../src/lib/connectDB'
import { decrypt, encrypt } from '../../../src/lib/cryptoUtils'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchCardDetail(req, res)
      break
    case 'PUT':
      await updateCardDetail(req, res)
      break
    case 'POST':
      await createCardDetails(req, res)
      break
    case 'DELETE':
      await deleteCardDetails(req, res)
      break
  }
}

const searchCardDetail = async (req, res) => {
  try {
    await connectDB()
    const { cardId } = req.query

    const cardDetails = await Card.findById(cardId)

    if (cardDetails) {
      cardDetails.cardNumber = decrypt(cardDetails.cardNumber)
      cardDetails.cvv = decrypt(cardDetails.cvv)

      return res
        .status(200)
        .json({ message: 'Card details found', cardDetails })
    } else {
      return res
        .status(404)
        .json({ message: 'Card not found', cardDetails: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const createCardDetails = async (req, res) => {
  try {
    await connectDB()

    const encryptedCardNumber = encrypt(req.body.cardNumber)
    const encryptedCVV = encrypt(req.body.cvv)

    const createCard = new Card({
      ...req.body,
      cardNumber: encryptedCardNumber,
      cvv: encryptedCVV
    })

    await createCard.save()
    res.json({
      message: 'Success! Payment Card Created',
      card: createCard
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateCardDetail = async (req, res) => {
  try {
    await connectDB()

    const { _id, cardNumber, cvv, ...otherDetails } = req.body

    const updatedData = {
      ...otherDetails
    }

    if (cardNumber) {
      updatedData.cardNumber = encrypt(cardNumber)
    }
    if (cvv) {
      updatedData.cvv = encrypt(cvv)
    }

    const card = await Card.findByIdAndUpdate(_id, updatedData, {
      new: true
    })

    if (card) {
      card.cardNumber = decrypt(card.cardNumber)
      card.cvv = decrypt(card.cvv)

      return res.status(200).json({ message: 'Card Updated', card })
    } else {
      return res
        .status(404)
        .json({ message: 'Card not found. Please try again!' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteCardDetails = async (req, res) => {
  try {
    await connectDB()

    const { cardId } = req.query
    console.log(cardId)

    const cardDetails = await Card.findOneAndDelete({ _id: cardId })

    if (cardDetails) {
      return res.status(200).json({ message: 'Card Deleted' })
    } else {
      return res.status(200).json({ message: 'Card not available' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
