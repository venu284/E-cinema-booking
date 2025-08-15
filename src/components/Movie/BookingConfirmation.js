import React from 'react'

export const BookingConfirmation = ({ booking }) => {
  const {
    movie,
    movieTiming,
    seatNumbers,
    adultTickets,
    childTickets,
    seniorTickets,
    totalPriceBeforeDiscount,
    discountAmount,
    totalPrice,
    promotionCode,
    bookingDate,
    paymentStatus
  } = booking

  return (
    <div className='bg-gray-800 p-6 rounded-lg text-white'>
      <h2 className='text-3xl font-bold mb-6 text-center'>
        Booking Confirmation
      </h2>

      <div className='flex items-center'>
        <div className='mb-6 w-[30%]'>
          {movie.image != '' && (
            <img
              src={movie?.image}
              alt={movie.title}
              className='w-full h-[50vh] object-fill rounded-lg mb-4'
            />
          )}
        </div>

        <div className='mx-10 w-[65%]'>
          <h3 className='text-2xl font-bold mb-2'>{movie.title}</h3>
          <div
            className='text-md mb-2'
            dangerouslySetInnerHTML={{
              __html: movie?.description || ''
            }}
          ></div>
          <p className='mb-2'>
            <strong>Genre:</strong> {movie.genre.join(', ')}
          </p>
          <p className='mb-2'>
            <strong>Duration:</strong> {movie.duration} minutes
          </p>
          <p className='mb-2'>
            <strong>Certificate:</strong> {movie.certificate}
          </p>
          <p className='mb-2'>
            <strong>Movie Timing:</strong>{' '}
            {new Date(movieTiming?.date).toLocaleDateString()},{' '}
            {movieTiming?.time}
          </p>

          <div className='mb-6 text-md'>
            <h4 className='text-lg font-semibold mb-2'>Your Booking Details</h4>
            <p className='mb-2'>
              <strong>Booking ID:</strong> {booking._id}
            </p>
            <p className='mb-2'>
              <strong>Booking Date:</strong>{' '}
              {new Date(bookingDate).toLocaleString()}
            </p>
            <p className='mb-2'>
              <strong>Seats:</strong> {seatNumbers.join(', ')}
            </p>
            <p className='mb-2'>
              <strong>Tickets:</strong>
            </p>
            <ul className='ml-4'>
              {adultTickets != 0 && <li>Adult: {adultTickets}</li>}
              {childTickets != 0 && <li>Child: {childTickets}</li>}
              {seniorTickets != 0 && <li>Senior: {seniorTickets}</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-4'>Payment Details</h4>
        {discountAmount > 0 && (
          <>
            <p className='mb-2'>
              <strong>Total Price Before Discount:</strong> $
              {totalPriceBeforeDiscount.toFixed(2)}
            </p>
            <p className='mb-2'>
              <strong>Discount Amount:</strong> -${discountAmount.toFixed(2)}
            </p>
          </>
        )}
        <p className='mb-2 font-semibold'>
          <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
        </p>
        {promotionCode && (
          <p className='mb-2'>
            <strong>Promotion Code Used:</strong> {promotionCode}
          </p>
        )}
        <p className='mb-2'>
          <strong>Payment Status:</strong> {paymentStatus}
        </p>
      </div>

      <div className='mt-6 text-center'>
        <button
          onClick={() => window.print()}
          className='bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded'
        >
          Print Confirmation
        </button>
      </div>
    </div>
  )
}
