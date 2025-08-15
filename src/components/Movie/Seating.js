import React from 'react'
import { useMovieBookingContext } from '../../context/MovieBookingContext'
import { Seat } from './Seat'

export const Seating = ({ seatLayout, bookedSeats }) => {
  const { selectedSeats, setSelectedSeats } = useMovieBookingContext()

  // Group seats by rows
  const groupedSeats = seatLayout.reduce((acc, seatId) => {
    const row = seatId.charAt(0)
    if (!acc[row]) {
      acc[row] = []
    }
    acc[row].push(seatId)
    return acc
  }, {})

  const handleSeatClick = seatId => {
    seatId = seatId.trim().toUpperCase()
    if (bookedSeats.includes(seatId)) return

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(selected => selected !== seatId))
    } else {
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  return (
    <div className='flex flex-col items-center text-white'>
      <div className='w-full max-w-4xl'>
        {Object.keys(groupedSeats)
          .sort()
          .map(row => (
            <div key={row} className='flex justify-center space-x-2 mb-4'>
              {groupedSeats[row]
                .sort((a, b) => {
                  const seatNumberA = parseInt(a.slice(1), 10)
                  const seatNumberB = parseInt(b.slice(1), 10)
                  return seatNumberA - seatNumberB
                })
                .map(seatId => (
                  <Seat
                    key={seatId}
                    seatId={seatId}
                    handleSeatClick={handleSeatClick}
                    bookedSeats={bookedSeats}
                    selectedSeats={selectedSeats}
                  />
                ))}
            </div>
          ))}
      </div>
    </div>
  )
}
