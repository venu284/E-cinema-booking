import React from 'react'

export const Profile = ({ userDetails }) => {
  return (
    <div className='mt-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3'>
        <div className='sm:col-span-1'>
          <dt className='capitalize text-md font-medium text-gray-200'>
            First Name
          </dt>
          <dd className=' text-md font-semibold text-gray-200'>
            {userDetails?.firstName}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='capitalize text-md font-medium text-gray-200'>
            Last Name
          </dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.lastName}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='text-md font-medium text-gray-200'>Email</dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.email}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='text-md font-medium text-gray-200'>Phone Number</dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.phone}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='text-md font-medium text-gray-200'>Promotions</dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.enabledPromotions ? 'Enabled' : 'Disabled'}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='text-md font-medium text-gray-200'>
            Account Verified
          </dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.isVerified ? 'Verified' : 'Not verified'}
          </dd>
        </div>
        <div className='sm:col-span-1'>
          <dt className='text-md font-medium text-gray-200'>Account Status</dt>
          <dd className=' font-semibold text-md text-gray-200'>
            {userDetails?.status ? 'Active' : 'In-Active'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
