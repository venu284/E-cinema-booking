import React, { useState } from 'react'
import { useModalContext } from '../../context/ModalContext'
import { useUser } from '../../lib/hooks'
import axios from 'axios'
import { toast } from 'react-toastify'
import { mutate } from 'swr'

export const ShowroomAddForm = () => {
  const { setIsOpen } = useModalContext()
  const user = useUser()
  const [loading, setLoading] = useState({ type: '', status: false })

  const [showroomName, setShowroomName] = useState('')

  const handleCloseClick = () => {
    setIsOpen(false)
  }

  const onSubmitHandler = async e => {
    e.preventDefault()
    setLoading({ type: 'create', status: false })

    try {
      const { data } = await axios.post(`/api/showrooms/`, {
        user: user?._id,
        name: showroomName
      })

      setLoading({ type: 'create', status: false })
      if (data?.message == 'Success! Showroom Created') {
        toast.success(data?.message, { toastId: data?.message })
        mutate(`/api/showrooms/`)
        setIsOpen(false)
      } else {
        toast.error(data?.message, { toastId: data?.message })
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='px-4 py-5'>
      <div className='mb-5 md:col-span-1'>
        <h3 className='text-lg font-medium leading-6 text-white'>
          Showroom Infomation
        </h3>
      </div>
      <div>
        <form
          className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'
          method='POST'
        >
          <div className='sm:col-span-6'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-100'
            >
              Showroom Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              value={showroomName}
              onChange={e => setShowroomName(e.target.value)}
              className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
            />
          </div>
        </form>

        <div className='flex justify-end mt-5'>
          <button
            type='button'
            onClick={handleCloseClick}
            className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
          >
            Cancel
          </button>
          <button
            disabled={loading?.status}
            onClick={e => onSubmitHandler(e)}
            className={`${
              loading?.status ? 'cursor-not-allowed' : 'hover:bg-orange-700 '
            } ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
