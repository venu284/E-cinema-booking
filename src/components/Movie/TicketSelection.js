import { useState } from 'react'
import { useMovieBookingContext } from '../../context/MovieBookingContext'

export const TicketSelection = () => {
  const {
    selectedSeats,
    adultTickets,
    setAdultTickets,
    childTickets,
    setChildTickets,
    seniorTickets,
    setSeniorTickets
  } = useMovieBookingContext()

  const totalTickets = adultTickets + childTickets + seniorTickets

  const handleConfirmBooking = () => {
    if (totalTickets !== selectedSeats.length) {
      alert(`Please allocate exactly ${selectedSeats.length} tickets.`)
      return
    }

    console.log('Confirmed booking:', {
      adultTickets,
      childTickets,
      seniorTickets
    })
    alert('Booking confirmed!')
  }

  const incrementTicket = (setter, value) => {
    if (totalTickets < selectedSeats.length) {
      setter(value + 1)
    }
  }

  const decrementTicket = (setter, value) => {
    if (value > 0) {
      setter(value - 1)
    }
  }

  const isIncrementDisabled = () => totalTickets >= selectedSeats.length

  const isDecrementDisabled = count => count <= 0

  return (
    <div className='p-10 text-white'>
      <h2 className='text-2xl font-bold mb-4'>Select Tickets</h2>
      <p className='mb-4'>
        You have selected <strong>{selectedSeats.length}</strong> seats. Please
        allocate the tickets:
      </p>

      {/* Adult Tickets */}
      <div className='mb-4'>
        <label className='block mb-2 text-lg font-semibold'>
          Adult Tickets
        </label>
        <div className='flex items-center justify-evenly'>
          {/* Decrement Button */}
          <button
            className={`px-4 py-2 bg-gray-600 text-white rounded ${
              isDecrementDisabled(adultTickets)
                ? 'cursor-not-allowed opacity-50'
                : ''
            }`}
            onClick={() => decrementTicket(setAdultTickets, adultTickets)}
            disabled={isDecrementDisabled(adultTickets)}
          >
            -
          </button>

          <span className='px-4'>{adultTickets}</span>

          {/* Increment Button */}
          <button
            className={`px-4 py-2 bg-gray-600 text-white rounded ${
              isIncrementDisabled() ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={() => incrementTicket(setAdultTickets, adultTickets)}
            disabled={isIncrementDisabled()}
          >
            +
          </button>
        </div>
      </div>

      {/* Child Tickets */}
      <div className='mb-4'>
        <label className='block mb-2 text-lg font-semibold'>
          Child Tickets
        </label>
        <div className='flex items-center justify-evenly'>
          {/* Decrement Button */}
          <button
            className={`px-4 py-2 bg-gray-600 text-white rounded ${
              isDecrementDisabled(childTickets)
                ? 'cursor-not-allowed opacity-50'
                : ''
            }`}
            onClick={() => decrementTicket(setChildTickets, childTickets)}
            disabled={isDecrementDisabled(childTickets)}
          >
            -
          </button>

          <span className='px-4'>{childTickets}</span>

          {/* Increment Button */}
          <button
            className={`px-4 py-2 bg-gray-600 text-white rounded ${
              isIncrementDisabled() ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={() => incrementTicket(setChildTickets, childTickets)}
            disabled={isIncrementDisabled()}
          >
            +
          </button>
        </div>
      </div>

      {/* Senior Tickets */}
      <div className='mb-4'>
        <label className='block mb-2 text-lg font-semibold'>
          Senior Tickets
        </label>
        <div className='flex items-center justify-evenly'>
          {/* Decrement Button */}
          <button
            className={`px-4 py-2 bg-gray-600 text-white rounded ${
              isDecrementDisabled(seniorTickets)
                ? 'cursor-not-allowed opacity-50'
                : ''
            }`}
            onClick={() => decrementTicket(setSeniorTickets, seniorTickets)}
            disabled={isDecrementDisabled(seniorTickets)}
          >
            -
          </button>

          <span className='px-4'>{seniorTickets}</span>

          {/* Increment Button */}
          <button
            className={`px-4 py-2 bg-gray-600 text-white rounded ${
              isIncrementDisabled() ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={() => incrementTicket(setSeniorTickets, seniorTickets)}
            disabled={isIncrementDisabled()}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
