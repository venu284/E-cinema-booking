import React from 'react'

export const Seat = ({
  seatId,
  handleSeatClick,
  bookedSeats,
  selectedSeats
}) => {
  const seatIdNormalized = seatId.trim().toUpperCase()
  const isBooked = bookedSeats.includes(seatIdNormalized)
  const isSelected = selectedSeats.includes(seatIdNormalized)

  const handleClick = () => {
    if (!isBooked) {
      handleSeatClick(seatId)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isBooked}
      className={`w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer ${
        isBooked
          ? 'bg-red-500 cursor-not-allowed'
          : isSelected
          ? 'bg-green-600'
          : 'bg-gray-500 hover:bg-gray-400'
      }`}
    >
      {seatId}
    </button>
  )
}
