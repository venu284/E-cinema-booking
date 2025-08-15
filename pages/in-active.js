import React from 'react'

const Inactive = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-8 text-center max-w-md'>
        <h2 className='text-2xl font-bold text-red-600 mb-4'>
          Account Inactive
        </h2>
        <p className='text-gray-900 mb-6'>
          Your account is currently inactive. Please contact support for further
          assistance.
        </p>
        <button
          onClick={() => (window.location.href = 'mailto:support@example.com')}
          className='bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 rounded transition-all'
        >
          Contact Support
        </button>
      </div>
    </div>
  )
}

export default Inactive
