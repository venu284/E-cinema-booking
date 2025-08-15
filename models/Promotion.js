import mongoose from 'mongoose'

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    promotionStartDate: {
      type: Date,
      required: true
    },
    promotionEndDate: {
      type: Date,
      required: true
    },
    code: {
      type: String
    },
    discountRate: {
      type: Number
    },
    selectedMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies'
      }
    ],
    status: {
      type: String
    },
    isSent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const Promotion =
  mongoose.models.promotions || mongoose.model('promotions', promotionSchema)

export default Promotion
