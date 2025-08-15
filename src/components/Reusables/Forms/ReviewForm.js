import React from 'react'
import { StarIcon } from '@heroicons/react/20/solid'

export const ReviewForm = ({
  rating,
  review,
  setRating,
  setReview,
  handleCreate
}) => {
  return (
    <div className='max-w-xl my-5'>
      <div className='flex mb-5 justify-between'>
        {[1, 2, 3, 4, 5].map(x => {
          return (
            <div
              key={x}
              className={`${x <= rating ? 'text-yellow-400' : 'text-gray-100'}`}
              onClick={() => setRating(x)}
            >
              <StarIcon className='h-8 w-8' />
            </div>
          )
        })}
      </div>
      <textarea
        placeholder='How was the movie?'
        value={review}
        onChange={e => setReview(e.target.value)}
        className='rounded-md w-full'
      />
      <div
        onClick={handleCreate}
        className={`mb-3 flex justify-center cursor-pointer py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700`}
      >
        Post Review
      </div>
    </div>
  )
}
