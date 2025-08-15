import mongoose from 'mongoose'

const paymentCardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true
    },
    cvv: {
      type: String,
      required: true
    },
    expiry: {
      type: String,
      required: true
    },
    cardType: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

const Card = mongoose.models.cards || mongoose.model('cards', paymentCardSchema)

export default Card
