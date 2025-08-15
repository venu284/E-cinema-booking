import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useModalContext } from '../../context/ModalContext'
import { mutate } from 'swr'

export const DeleteUserForm = () => {
  const { setIsOpen, setForm, deleteId } = useModalContext()
  const [userName, setUserName] = useState('')

  const handleDelete = async e => {
    const {
      data: { message }
    } = await axios.delete(`/api/user/userdetails?userId=${deleteId?._id}`)
    if (message == 'User Deleted') {
      await mutate('/api/user/userdetails')
      setIsOpen(false)
      setForm('')
      toast.success(message, { toastId: message })
    } else {
      toast.error(message, { toastId: message })
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
            Please type{' '}
            <span className='text-red-500 select-none'>{deleteId?.email}</span>{' '}
            to confirm
          </label>
          <input
            type='text'
            name='delete'
            value={userName}
            onChange={e => setUserName(e.target.value)}
            id='delete'
            className='block w-full border-0 p-0 text-gray-100 bg-gray-800 focus:ring-0 sm:text-sm'
          />
        </div>
        <button
          type='button'
          disabled={userName !== deleteId?.email}
          onClick={() => {
            if (userName === deleteId?.email) {
              handleDelete()
            }
          }}
          className={`w-full my-2 block items-center px-4 py-1 border border-transparent text-md font-semibold rounded-md ${
            userName === deleteId?.email
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-red-700 cursor-not-allowed'
          }`}
        >
          I understand the consequences, delete this user
        </button>
      </div>
    </form>
  )
}
