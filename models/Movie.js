import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    cast: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        value: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: String,
    trailer: String,
    movieStartDate: {
      type: Date,
      required: true
    },
    movieEndDate: {
      type: Date,
      required: true
    },
    genre: {
      type: [String]
    },
    duration: {
      type: Number,
      min: 1
    },
    status: {
      type: String
    },
    certificate: {
      type: String
    },
    ticketPrices: {
      adult: {
        type: String
      },
      child: {
        type: String
      },
      senior: {
        type: String
      }
    }
  },
  { timestamps: true }
)

const Movie = mongoose.models.movies || mongoose.model('movies', movieSchema)

export default Movie
