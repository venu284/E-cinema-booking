import MovieTiming from '../../../models/MovieTiming'
import seatLayout from '../../../src/lib/config/seatLayout'
import connectDB from '../../../src/lib/connectDB'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      await connectDB()

      const { movieId, date, time } = req.query

      if (!movieId || !date || !time) {
        return res.status(400).json({ message: 'Missing parameters' })
      }

      const movieTiming = await MovieTiming.findOne({
        movie: movieId,
        date: new Date(date),
        time: time
      })

      let bookedSeats = []

      if (movieTiming) {
        bookedSeats = movieTiming.seatsBooked.map(seatId =>
          seatId.trim().toUpperCase()
        )
      }

      const normalizedSeatLayout = seatLayout.map(seatId =>
        seatId.trim().toUpperCase()
      )

      res.status(200).json({ seatLayout: normalizedSeatLayout, bookedSeats })
    } catch (error) {
      console.error('Error fetching seat data:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
