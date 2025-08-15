import React from 'react'
import { useUser } from '../lib/hooks'
import Image from 'next/image'
import { useAllMovieBookingDetails } from '../hooks/useAllMovieBookingDetails'
import moment from 'moment-timezone'
import { useModalContext } from '../context/ModalContext'

export const Bookings = () => {
  const { setIsOpen, setForm, setDeleteId } = useModalContext()
  const user = useUser()
  const { bookings, loading } = useAllMovieBookingDetails(user?._id)

  const isCancelable = timing => {
    const showDateTime = moment.tz(
      `${timing?.date} ${timing?.time}`,
      'YYYY-MM-DD HH:mm',
      'America/New_York'
    )
    const currentDateTime = moment.tz('America/New_York')
    const diffMinutes = showDateTime.diff(currentDateTime, 'minutes')
    return diffMinutes > 60 // Allow cancellation only if more than 60 minutes remain
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-lg font-semibold'>Loading your bookings...</p>
      </div>
    )
  }

  if (!bookings) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-lg font-semibold'>No bookings found.</p>
      </div>
    )
  }

  return (
    <div className='my-5 max-w-4xl mx-auto'>
      <ul className='space-y-4'>
        {bookings?.map(booking => (
          <li
            key={booking?._id}
            className='p-4 border rounded-lg shadow-md bg-white'
          >
            <div className='grid grid-cols-3 gap-4'>
              <div className='w-full h-full relative'>
                <Image
                  src={
                    booking?.movie?.image || 'https://via.placeholder.com/150'
                  }
                  alt={booking?.movie.title}
                  fill
                  className='object-cover rounded-md'
                />
              </div>

              <div className='col-span-2 text-gray-700'>
                <h2 className='text-lg font-bold text-gray-700'>
                  {booking?.movie?.title} ({booking?.movie?.genre.join(', ')})
                </h2>
                <p className='text-sm text-gray-700'>
                  Duration: {booking?.movie?.duration} mins
                </p>
                {console.log(booking)}
                <p className='text-sm text-gray-700'>
                  Timing:{' '}
                  {moment
                    .tz(
                      `${booking?.movieTiming?.date} ${booking?.movieTiming?.time}`,
                      'YYYY-MM-DD HH:mm',
                      'America/New_York'
                    )
                    .format('MM/DD/YYYY HH:mm A')}
                </p>
                <p className='text-sm text-gray-700'>
                  Tickets: {booking?.adultTickets} Adult,{' '}
                  {booking?.childTickets} Child, {booking?.seniorTickets} Senior
                </p>
                <p className='text-sm text-gray-700'>
                  Seats: {booking?.seatNumbers.join(', ')}
                </p>
              </div>
            </div>

            <hr className='my-2' />

            <div className='flex justify-between items-center text-sm'>
              <div>
                <p className='text-gray-700'>
                  Total Price:{' '}
                  <span className='font-semibold'>${booking?.totalPrice}</span>
                </p>
                <p className='text-gray-700'>
                  Payment Status:{' '}
                  <span
                    className={`font-semibold ${
                      booking?.paymentStatus === 'Paid'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {booking?.paymentStatus}
                  </span>
                </p>
                <p className='text-gray-700'>
                  Promotion Code: {booking?.promotionCode || 'N/A'}
                </p>
              </div>

              <div className='text-right'>
                <p className='text-gray-700'>
                  Booking Date:{' '}
                  {moment
                    .tz(booking?.bookingDate, 'America/New_York')
                    .format('MM/DD/YYYY HH:mm A')}
                </p>

                {isCancelable(booking?.movieTiming) ? (
                  <button
                    onClick={() => {
                      setForm('deleteBookingForm')
                      setIsOpen(true)
                      setDeleteId(booking?._id)
                    }}
                    className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700'
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <p className='text-sm text-gray-500 mt-2'>
                    Cannot cancel less than 60 minutes before the show.
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
