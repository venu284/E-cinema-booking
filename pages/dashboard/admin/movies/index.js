import React from 'react'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'
import { Heading } from '../../../../src/components/Reusables/Heading'
import { useAllMovieDetails } from '../../../../src/hooks/useAllMovieDetails'
import Link from 'next/link'
import { useModalContext } from '../../../../src/context/ModalContext'

const AdminMovies = () => {
  const { movies, isLoading } = useAllMovieDetails()
  const { setForm, setDeleteId, setIsOpen } = useModalContext()
  return (
    <div className='mt-[10vh]'>
      <Heading
        title={'Movies'}
        button={'Add Movie'}
        href={'/dashboard/admin/movies/add'}
      />

      <div className='mt-8 flow-root max-w-6xl mx-auto'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-6'
                    >
                      Movie Id
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Title
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Release Date
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Duration
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Certificate
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Playing
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Draft
                    </th>
                    <th
                      scope='col'
                      className='relative py-3.5 pl-3 pr-4 sm:pr-6'
                    >
                      <span className='sr-only'>Edit</span>
                    </th>
                    <th
                      scope='col'
                      className='relative py-3.5 pl-3 pr-4 sm:pr-6'
                    >
                      <span className='sr-only'>Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {movies?.map(movie => (
                    <tr key={movie?._id}>
                      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6'>
                        {movie?._id}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {movie?.title}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {new Date(movie?.movieStartDate).toLocaleDateString(
                          'en-US'
                        )}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {movie?.duration}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {movie?.certificate}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {new Date(movie?.movieEndDate) < new Date()
                          ? 'False'
                          : 'True'}
                      </td>

                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {movie?.status == 'Draft' ? 'True' : 'False'}
                      </td>
                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                        <Link
                          href={`/dashboard/admin/movies/${movie?._id}/edit`}
                          className='text-orange-600 hover:text-orange-900'
                        >
                          Edit<span className='sr-only'>, {movie?.name}</span>
                        </Link>
                      </td>
                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-red-600 hover:text-red-900 cursor-pointer'>
                        <button
                          onClick={() => {
                            setForm('DeleteFormModal')
                            setIsOpen(true)
                            setDeleteId(movie)
                          }}
                          className='text-red-600 hover:text-red-500 cursor-pointer'
                        >
                          Delete<span className='sr-only'>, {movie?.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ req, res, query }) => {
  const session = await getLoginSession(req)
  const user = (session?._doc && (await findUser(session._doc))) ?? null
  if (!user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    }
  }

  if (user.category !== 'admin') {
    return {
      redirect: {
        destination: `/`,
        permanent: false
      }
    }
  }

  if (!user?.isVerified) {
    return {
      redirect: {
        destination: `/auth/verify`,
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default AdminMovies
