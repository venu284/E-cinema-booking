import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { cardOptions, getSelected, stateOptions } from '../../lib/helper'
import { DropDown } from '../Reusables/Forms/Dropdown'
import { useModalContext } from '../../context/ModalContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { mutate } from 'swr'
import { useSingleCardDetail } from '../../hooks/useSingleCardDetails'
import { useUser } from '../../lib/hooks'

export const CardEditForm = () => {
  const user = useUser()
  const { setIsOpen, editId } = useModalContext()
  const { cardDetail } = useSingleCardDetail(editId)
  console.log(cardDetail)
  const [loading, setLoading] = useState({ type: '', status: false })

  const [cardDetails, setCardDetails] = useState({
    cardNumber: cardDetail?.cardNumber,
    cardCVV: cardDetail?.cvv,
    expiry: cardDetail?.expiry
  })

  const [address, setAddress] = useState({
    street: cardDetail?.street,
    city: cardDetail?.city,
    zipcode: cardDetail?.zipCode
  })

  const [selectedCard, setSelectedCard] = useState(
    getSelected(cardOptions, cardDetail?.cardType)
  )

  const [selectedState, setSelectedState] = useState(
    getSelected(stateOptions, cardDetail?.state)
  )

  useEffect(() => {
    if (cardDetail) {
      setCardDetails({
        cardNumber: cardDetail?.cardNumber,
        cardCVV: cardDetail?.cvv,
        expiry: cardDetail?.expiry
      })
      setAddress({
        street: cardDetail?.street,
        city: cardDetail?.city,
        zipcode: cardDetail?.zipCode
      })
    }
  }, [cardDetail])

  useEffect(() => {
    setSelectedCard(getSelected(cardOptions, cardDetail?.cardType))
  }, [cardDetail])

  useEffect(() => {
    setSelectedState(getSelected(stateOptions, cardDetail?.state))
  }, [cardDetail])

  const handleCloseClick = () => {
    setIsOpen(false)
  }

  const onSubmitHandler = async e => {
    e.preventDefault()
    setLoading({ type: 'edit', status: true })

    try {
      const { data } = await axios.put(`/api/card/carddetails`, {
        ...cardDetail,
        cardNumber: cardDetails?.cardNumber,
        cvv: Number(cardDetails?.cardCVV),
        expiry: cardDetails?.expiry,
        cardType: selectedCard?.name,
        street: address?.street,
        city: address?.city,
        state: selectedState?.name,
        zipCode: Number(address?.zipcode)
      })

      setLoading({ type: 'edit', status: false })
      if (data?.message == 'Card Updated') {
        toast.success(data?.message, { toastId: data?.message })
        mutate(`/api/payment-cards?userId=${user?._id}`)
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
        <h3 className='text-lg font-medium leading-6 text-gray-700'>
          Card Infomation
        </h3>
      </div>
      <div>
        <form
          className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'
          method='POST'
        >
          <div className='sm:col-span-2'>
            <label
              htmlFor='cardNumber'
              className='block text-sm font-medium text-gray-900'
            >
              Card Number
            </label>
            <input
              type='text'
              name='cardNumber'
              id='cardNumber'
              value={cardDetails?.cardNumber}
              onChange={e => {
                setCardDetails({ ...cardDetails, cardNumber: e.target.value })
              }}
              autoComplete='off'
              className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
            />
          </div>
          <div className='sm:col-span-1'>
            <label
              htmlFor='expiry'
              className='block text-sm font-medium text-gray-900'
            >
              Expiry
            </label>
            <input
              type='text'
              name='expiry'
              id='expiry'
              value={cardDetails?.expiry}
              onChange={e => {
                setCardDetails({ ...cardDetails, expiry: e.target.value })
              }}
              autoComplete='off'
              className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
            />
          </div>
          <div className='sm:col-span-1'>
            <label
              htmlFor='cvv'
              className='block text-sm font-medium text-gray-900'
            >
              CVV
            </label>
            <input
              type='text'
              name='cvv'
              id='cvv'
              value={cardDetails?.cardCVV}
              onChange={e => {
                setCardDetails({ ...cardDetails, cardCVV: e.target.value })
              }}
              autoComplete='off'
              className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
            />
          </div>

          <div className='sm:col-span-2 relative -top-[22px]'>
            <DropDown
              title={'Card Type'}
              options={cardOptions}
              selectedOption={selectedCard}
              setSelectedOption={setSelectedCard}
            />
          </div>

          <h6 className='font-medium leading-6'>Billing Address</h6>

          <div className='sm:col-span-6'>
            <label
              htmlFor='street'
              className='block text-sm font-medium text-gray-900'
            >
              Street
            </label>
            <input
              type='text'
              name='street'
              id='street'
              value={address?.street}
              onChange={e => {
                setAddress({ ...address, street: e.target.value })
              }}
              autoComplete='address-line1'
              className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
            />
          </div>

          <div className='sm:col-span-2'>
            <label
              htmlFor='city'
              className='block text-sm font-medium text-gray-900'
            >
              City
            </label>
            <input
              type='text'
              name='city'
              id='city'
              value={address?.city}
              onChange={e => {
                setAddress({ ...address, city: e.target.value })
              }}
              autoComplete='address-level2'
              className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
            />
          </div>

          <div className='sm:col-span-2 relative -top-[22px]'>
            <DropDown
              title={'State'}
              options={stateOptions}
              selectedOption={selectedState}
              setSelectedOption={setSelectedState}
            />
          </div>

          <div className='sm:col-span-2'>
            <label
              htmlFor='zipcode'
              className='block text-sm font-medium text-gray-900'
            >
              Zip Code
            </label>
            <input
              type='text'
              name='zipcode'
              id='zipcode'
              value={address?.zipcode}
              onChange={e => {
                setAddress({ ...address, zipcode: e.target.value })
              }}
              autoComplete='postal-code'
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
