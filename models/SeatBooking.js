import mongoose from 'mongoose'

const seatBookingSchema = new mongoose.Schema(
  {
    seatNumbers: [
      {
        type: String,
        required: true
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'cards',
      required: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'movies',
      required: true
    },
    movieTiming: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'movietimings',
      required: true
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Paid'
    },
    adultTickets: {
      type: Number,
      required: true,
      min: 0
    },
    childTickets: {
      type: Number,
      required: true,
      min: 0
    },
    seniorTickets: {
      type: Number,
      required: true,
      min: 0
    },
    totalPriceBeforeDiscount: {
      type: Number,
      required: true,
      min: 0
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    promotionCode: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

const SeatBooking =
  mongoose.models.seatbookings ||
  mongoose.model('seatbookings', seatBookingSchema)

export default SeatBooking
