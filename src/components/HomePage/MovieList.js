import React from 'react'
import Link from 'next/link'

export const MovieList = ({ title, movielist }) => {
  return (
    <div className='bg-white p-4 rounded shadow'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold tracking-tight text-gray-700'>
          {title}
        </h2>
      </div>

      {movielist.length === 0 ? (
        <p className='text-gray-900'>No movies found matching your search.</p>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {movielist
            .filter(movie => movie.status === 'Public')
            .map(movie => (
              <div key={movie._id} className='group relative'>
                <div className='w-full h-64 bg-gray-200 rounded-md overflow-hidden group-hover:opacity-75'>
                  <img
                    alt={`${movie.title} image`}
                    src={movie.image}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='mt-4 flex justify-between'>
                  <div className='w-3/4'>
                    <h3 className='text-sm font-semibold text-gray-900'>
                      <Link href={`/movieoverview/${movie._id}`}>
                        <span>{movie.title}</span>
                      </Link>
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {movie.genre.join(', ')}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Release Date:{' '}
                      {new Date(movie.movieStartDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className='text-sm font-semibold text-orange-600'>
                    {movie.certificate}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
