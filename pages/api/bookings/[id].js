import SeatBooking from '../../../models/SeatBooking'
import MovieTiming from '../../../models/MovieTiming'
import connectDB from '../../../src/lib/connectDB'
import { createTransport } from 'nodemailer'

const handler = async (req, res) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const { userId, id } = req.query

      const booking = await SeatBooking.findOne({ _id: id, user: userId })
        .populate({
          path: 'movie',
          select: 'title description image genre duration certificate'
        })
        .populate('movieTiming')

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found.' })
      }

      res.status(200).json({ booking })
    } catch (error) {
      console.error('Error fetching booking:', error)
      res.status(500).json({ message: 'Internal server error.' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id: bookingId } = req.query

      // Fetch the booking
      const booking = await SeatBooking.findById(bookingId)
        .populate('movieTiming')
        .populate('movie')
        .populate('user')

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' })
      }

      // Remove booked seats from MovieTiming
      await MovieTiming.updateOne(
        { _id: booking.movieTiming._id },
        {
          $pull: { seatsBooked: { $in: booking.seatNumbers } }
        }
      )

      // Delete the booking
      await SeatBooking.deleteOne({ _id: booking._id })

      // Send cancellation email
      const transporter = createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASSWORD
        }
      })

      const mailOptions = {
        from: 'firozkhanp009@gmail.com',
        to: booking.user.email,
        subject: `Booking Cancellation for ${booking.movie.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding-bottom: 20px;">
              <h2 style="color: #333; margin-top: 20px;">Booking Cancellation</h2>
            </div>

            <div style="padding: 10px 0;">
              <h3 style="color: #555; font-size: 20px; font-weight: bold;">${
                booking.movie.title
              }</h3>
              <p><strong>Description:</strong> ${booking.movie.description}</p>
              <p><strong>Genre:</strong> ${booking.movie.genre.join(', ')}</p>
              <p><strong>Duration:</strong> ${
                booking.movie.duration
              } minutes</p>
              <p><strong>Certificate:</strong> ${booking.movie.certificate}</p>
              <p><strong>Movie Timing:</strong> ${new Date(
                booking.movieTiming.date
              ).toLocaleDateString()} at ${booking.movieTiming.time}</p>
            </div>

            <hr style="border-top: 1px solid #ddd; margin: 20px 0;" />

            <h3 style="color: #0073e6; font-size: 18px;">Canceled Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Booking Date:</strong> ${new Date(
              booking.bookingDate
            ).toLocaleString()}</p>
            <p><strong>Seats:</strong> ${booking.seatNumbers.join(', ')}</p>
            <p><strong>Tickets:</strong></p>
            <ul style="margin-left: 20px;">
              ${
                booking.adultTickets
                  ? `<li>Adult: ${booking.adultTickets}</li>`
                  : ''
              }
              ${
                booking.childTickets
                  ? `<li>Child: ${booking.childTickets}</li>`
                  : ''
              }
              ${
                booking.seniorTickets
                  ? `<li>Senior: ${booking.seniorTickets}</li>`
                  : ''
              }
            </ul>

            <hr style="border-top: 1px solid #ddd; margin: 20px 0;" />

            <p style="color: #555;">We regret to inform you that your booking for the above movie has been canceled. If you have any questions, please contact our support team.</p>

            <p style="text-align: center; color: #888; font-size: 12px;">Thank you for choosing our service!</p>
          </div>
        `
      }

      await transporter.sendMail(mailOptions)

      return res.status(200).json({ message: 'Booking canceled successfully' })
    } catch (error) {
      console.error('Error during booking cancellation:', error)
      return res.status(500).json({
        message: 'An error occurred while canceling the booking.'
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
