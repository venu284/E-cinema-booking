import mongoose, { mongo } from 'mongoose'

const movieTimingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    showroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'showrooms',
      required: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'movies',
      required: true
    },
    seatsBooked: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
)

const MovieTiming =
  mongoose.models.movietimings ||
  mongoose.model('movietimings', movieTimingSchema)

export default MovieTiming
