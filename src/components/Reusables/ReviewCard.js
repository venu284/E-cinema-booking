import React from 'react'
import { StarIcon } from '@heroicons/react/20/solid'

export const ReviewCard = ({ review }) => {
  return (
    <div className='w-full mb-5 shadow p-4 border rounded-md border-gray-100'>
      <div className='flex justify-start'>
        <div className='mr-3'>
          <img
            src={review.user?.image}
            className='h-12 w-12 rounded-full'
            alt='product-image'
          />
        </div>
        <div>
          <div className='font-bold text-white'>
            {review.user?.firstName + ' ' + review.user?.lastName}
          </div>
          <div className='flex items-center'>
            {[1, 2, 3, 4, 5].map(x => {
              return (
                <div
                  key={x}
                  className={`${
                    x <= review.rating ? 'text-yellow-400' : 'text-gray-900'
                  }`}
                  onClick={() => setRating(x)}
                >
                  <StarIcon className='h-4 w-4' />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div>
        <p className='text-semibold text-white mt-3 italic'>{review.comment}</p>
      </div>
    </div>
  )
}
