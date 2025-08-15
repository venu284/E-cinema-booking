import Link from 'next/link'
import React from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useModalContext } from '../context/ModalContext'
import { maskCardNumber } from '../lib/helper'
import { Banner } from './Reusables/Banner'
import { useAllUserCardDetails } from '../hooks/useAllUserCardDetails'
import { useUser } from '../lib/hooks'

export const Cards = () => {
  const { setIsOpen, setForm, setEditId, setDeleteId } = useModalContext()
  const user = useUser()
  const { cards } = useAllUserCardDetails(user?._id)

  const handleAddCardClick = () => {
    setIsOpen(true)
    setForm('CardAddForm')
  }

  return (
    <div className='max-w-5xl mx-auto overflow-hidden'>
      {cards?.length == 3 && (
        <Banner
          message={
            'You’ve reached the maximum limit of 3 cards. Please remove a card to add a new one.'
          }
        />
      )}
      <div className='my-10 px-4 sm:px-6 lg:px-8 mx-auto grid grid-cols-3 gap-4 w-full'>
        {cards?.length != 3 && (
          <button
            onClick={handleAddCardClick}
            className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 shadow-md rounded-md hover:bg-gray-50 w-80 h-64'
          >
            <PlusIcon className={'h-10 w-10 text-[#ccc]'} />
            <h1 className='mt-2 text-lg font-bold text-gray-400'>Add Card</h1>
          </button>
        )}
        {cards?.map(detail => (
          <div
            key={detail?._id}
            className='border rounded-md pb-4 px-5 shadow-md grid gap-4 content-between w-80 h-64'
          >
            <div>
              <h3 className='font-semibold py-3 text-center border-b-2'>
                {maskCardNumber(detail?.cardNumber)}
              </h3>
              <p className='text-sm mt-4 font-semibold text-gray-200'>
                {detail?.street}
              </p>

              <p className='text-sm my-1 font-semibold text-gray-200'>
                {detail?.area?.length >= 35
                  ? `${detail?.area?.slice(0, 35)}...`
                  : detail?.area}
              </p>
              <p className='text-sm my-1 uppercase font-semibold text-gray-200'>
                {detail?.city}, {detail?.state}
              </p>
              <p className='text-sm my-1 font-semibold text-gray-200'>
                {detail?.zipCode}
              </p>
            </div>
            <div className='flex'>
              <button
                onClick={() => {
                  setIsOpen(true)
                  setForm('CardEditForm')
                  setEditId(detail?._id)
                }}
                className='text-sm font-semibold text-orange-800 pr-5 border-r-2 border-gray-800 hover:text-orange-500'
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setIsOpen(true)
                  setForm('CardDeleteForm')
                  setDeleteId(detail?._id)
                }}
                className='text-sm font-semibold text-red-600 pl-5 hover:text-red-500'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
