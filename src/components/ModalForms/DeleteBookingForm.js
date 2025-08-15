import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useModalContext } from '../../context/ModalContext'
import { mutate } from 'swr'
import { useUser } from '../../lib/hooks'

export const DeleteBookingForm = () => {
  const { setIsOpen, deleteId } = useModalContext()
  const [cardName, setCardName] = useState('')
  const user = useUser()

  const handleDelete = async id => {
    try {
      const response = await axios.delete(`/api/bookings/${id}`)
      if (response.status === 200) {
        toast.success('Booking canceled successfully!')

        console.log(
          `Mutating SWR cache for key: /api/bookings?userId=${user?._id}`
        )

        await mutate(`/api/bookings?userId=${user?._id}`, true)
        setIsOpen(false)
      } else {
        toast.error('Failed to cancel booking. Please try again.')
      }
    } catch (error) {
      console.error('Error canceling booking:', error)
      toast.error('An error occurred while canceling the booking.')
    }
  }

  return (
    <form>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-medium leading-6 text-white'>
          Are you absolutely sure?
        </h3>
      </div>
      <div className='mt-5 w-full'>
        <div className='relative border  rounded-md px-3 py-2 shadow-sm focus-within:ring-1 '>
          <label
            htmlFor='delete'
            className='absolute -top-2 left-2 -mt-px inline-block px-1 text-xs bg-gray-800 font-medium text-white'
          >
            Please type <span className='text-red-500 select-none'>cancel</span>{' '}
            to confirm
          </label>
          <input
            type='text'
            name='delete'
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            id='delete'
            className='block w-full border-0 p-0 text-gray-100 bg-gray-800 focus:ring-0 sm:text-sm'
          />
        </div>
        <button
          type='button'
          disabled={cardName !== 'cancel'}
          onClick={() => {
            handleDelete(deleteId)
          }}
          className={`w-full my-2 block items-center px-4 py-1 border border-transparent text-md font-semibold rounded-md ${
            cardName === 'cancel'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-red-700 cursor-not-allowed'
          }`}
        >
          I understand the consequences, cancel this booking
        </button>
      </div>
    </form>
  )
}
