import React from 'react'

export const Address = ({ userDetails }) => {
  return (
    <div className='mt-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3'>
        <div className='sm:col-span-1'>
          <dt className='capitalize text-md font-medium text-gray-200'>
            Street
          </dt>
          <dd className='text-md font-semibold text-gray-200'>
            {userDetails?.address?.street ? userDetails?.address?.street : '-'}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='capitalize text-md font-medium text-gray-200'>City</dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.address?.city ? userDetails?.address?.city : '-'}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='text-md font-medium text-gray-200'>State</dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.address?.state ? userDetails?.address?.state : '-'}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='text-md font-medium text-gray-200'>Zip Code</dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.address?.zipCode
              ? userDetails?.address?.zipCode
              : '-'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
