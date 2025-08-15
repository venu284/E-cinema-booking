import MovieTiming from '../../../models/MovieTiming'
import Card from '../../../models/PaymentCard'
import SeatBooking from '../../../models/SeatBooking'
import connectDB from '../../../src/lib/connectDB'
import { createTransport } from 'nodemailer'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchSeatBooking(req, res)
      break
    case 'POST':
      await createSeatBooking(req, res)
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

const searchSeatBooking = async (req, res) => {
  const { userId } = req.query
  try {
    await connectDB()

    const bookings = await SeatBooking.find({ user: userId })
      .populate('movie', 'title genre duration image certificate description')
      .populate('movieTiming', 'date time')
      // .populate('card', 'cardNumber')
      .exec()

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' })
    }

    // const decryptedBookings = bookings.map(booking => {
    //   if (booking.card && booking.card.cardNumber) {
    //     booking.card.cardNumber = decrypt(booking.card.cardNumber)
    //   }
    //   return booking
    // })

    return res.status(200).json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const createSeatBooking = async (req, res) => {
  try {
    await connectDB()

    const userId = req.query.userId
    const {
      seatNumbers,
      movieId,
      date,
      time,
      tickets,
      discountAmount,
      totalPrice,
      promotionCode,
      card,
      totalPriceBeforeDiscount,
      paymentCardId
    } = req.body

    if (
      !seatNumbers ||
      !Array.isArray(seatNumbers) ||
      seatNumbers.length === 0
    ) {
      return res.status(400).json({ message: 'No seats selected.' })
    }

    if (!movieId || !date || !time) {
      return res
        .status(400)
        .json({ message: 'Invalid movie timing information.' })
    }

    if (!paymentCardId) {
      return res.status(400).json({ message: 'No payment card selected.' })
    }

    const paymentCard = await Card.findOne({ _id: paymentCardId, user: userId })
    if (!paymentCard) {
      return res.status(400).json({ message: 'Invalid payment card.' })
    }

    const dateObject = new Date(date)

    let movieTiming = await MovieTiming.findOne({
      movie: movieId,
      date: dateObject,
      time: time
    })

    if (!movieTiming) {
      movieTiming = new MovieTiming({
        movie: movieId,
        date: dateObject,
        time: time,
        seatsBooked: []
      })
      await movieTiming.save()
    }

    const normalizedSeatNumbers = seatNumbers.map(seatId =>
      seatId.trim().toUpperCase()
    )

    const alreadyBookedSeats = movieTiming.seatsBooked.map(seatId =>
      seatId.trim().toUpperCase()
    )
    const conflictSeats = normalizedSeatNumbers.filter(seatId =>
      alreadyBookedSeats.includes(seatId)
    )

    if (conflictSeats.length > 0) {
      return res.status(400).json({
        message: `The following seats are already booked: ${conflictSeats.join(
          ', '
        )}`
      })
    }

    const seatBooking = new SeatBooking({
      seatNumbers: normalizedSeatNumbers,
      user: userId,
      movie: movieId,
      card,
      movieTiming: movieTiming._id,
      bookingDate: new Date(),
      paymentStatus: 'Paid',
      adultTickets: tickets?.adult,
      childTickets: tickets?.child,
      seniorTickets: tickets?.senior,
      totalPrice,
      discountAmount,
      totalPriceBeforeDiscount,
      promotionCode
    })

    const savedBooking = await seatBooking.save()

    await MovieTiming.updateOne(
      { _id: movieTiming._id },
      { $addToSet: { seatsBooked: { $each: normalizedSeatNumbers } } }
    )

    const populatedBooking = await SeatBooking.findById(savedBooking._id)
      .populate('movie')
      .populate('movieTiming')
      .populate('user')

    const { movie, user } = populatedBooking

    console.log(movie, user, populatedBooking)

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
      to: user.email,
      subject: `Booking Confirmation for ${movie.title} - Enjoy the Show!`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="${movie.image || 'https://via.placeholder.com/150'}" alt="${
        movie.title
      }" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 10px;" />
          <h2 style="color: #333; margin-top: 20px;">Booking Confirmation</h2>
        </div>

        <div style="padding: 10px 0;">
          <h3 style="color: #555; font-size: 20px; font-weight: bold;">${
            movie.title
          }</h3>
          <p><strong>Description:</strong> ${movie.description}</p>
          <p><strong>Genre:</strong> ${movie.genre.join(', ')}</p>
          <p><strong>Duration:</strong> ${movie.duration} minutes</p>
          <p><strong>Certificate:</strong> ${movie.certificate}</p>
          <p><strong>Movie Timing:</strong> ${new Date(
            movieTiming.date
          ).toLocaleDateString()} at ${movieTiming.time}</p>
        </div>

        <hr style="border-top: 1px solid #ddd; margin: 20px 0;" />

        <h3 style="color: #0073e6; font-size: 18px;">Your Booking Details</h3>
        <p><strong>Booking ID:</strong> ${populatedBooking._id}</p>
        <p><strong>Booking Date:</strong> ${new Date(
          populatedBooking.bookingDate
        ).toLocaleString()}</p>
        <p><strong>Seats:</strong> ${seatNumbers.join(', ')}</p>
        <p><strong>Tickets:</strong></p>
        <ul style="margin-left: 20px;">
          ${tickets.adult ? `<li>Adult: ${tickets.adult}</li>` : ''}
          ${tickets.child ? `<li>Child: ${tickets.child}</li>` : ''}
          ${tickets.senior ? `<li>Senior: ${tickets.senior}</li>` : ''}
        </ul>

        <hr style="border-top: 1px solid #ddd; margin: 20px 0;" />

        <h3 style="color: #0073e6; font-size: 18px;">Payment Details</h3>
        ${
          populatedBooking?.discountAmount > 0
            ? `
          <p><strong>Total Price Before Discount:</strong> $${populatedBooking?.totalPriceBeforeDiscount}</p>
          <p><strong>Discount Amount:</strong> -$${populatedBooking?.discountAmount}</p>
        `
            : ''
        }
        <p><strong>Total Price:</strong> $${populatedBooking?.totalPrice}</p>
        ${
          populatedBooking?.promotionCode
            ? `<p><strong>Promotion Code Used:</strong> ${populatedBooking?.promotionCode}</p>`
            : ''
        }
        <p><strong>Payment Status:</strong> ${
          populatedBooking?.paymentStatus
        }</p>
      </div>
      `
    }

    await transporter.sendMail(mailOptions)

    res
      .status(200)
      .json({ message: 'Booking successful.', seatBooking: populatedBooking })
  } catch (error) {
    console.error('Error creating booking:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}
