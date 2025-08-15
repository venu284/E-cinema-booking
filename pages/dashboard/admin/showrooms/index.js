import React from 'react'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'
import { useModalContext } from '../../../../src/context/ModalContext'
import { useAllShowroomDetails } from '../../../../src/hooks/useAllShowroomDetails'

const AdminShowrooms = () => {
  const { showrooms } = useAllShowroomDetails()
  const { setForm, setDeleteId, setIsOpen } = useModalContext()

  const handleOnClickAddShowroom = () => {
    setIsOpen(true)
    setForm('ShowroomAddForm')
  }

  return (
    <div className='mt-[10vh]'>
      <div className='md:flex md:items-center md:justify-between max-w-6xl mx-auto py-5'>
        <div className='min-w-0 flex-1'>
          <h2 className='text-2xl font-bold leading-7 text-gray-200 sm:truncate sm:text-3xl sm:tracking-tight'>
            Showrooms
          </h2>
        </div>
        <div className='mt-4 flex md:ml-4 md:mt-0'>
          <button
            onClick={handleOnClickAddShowroom}
            type='button'
            className='ml-3 inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
          >
            Add Showroom
          </button>
        </div>
      </div>
      <div className='mt-8 flow-root max-w-6xl mx-auto'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Showroom Id
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      User Id
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Showroom Name
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
                  {showrooms?.map(showroom => (
                    <tr key={showroom?._id}>
                      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6'>
                        {showroom?._id}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {showroom?.user}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {showroom?.name}
                      </td>

                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                        <button
                          onClick={() => {
                            setForm('ShowroomEditForm')
                            setIsOpen(true)
                            setDeleteId(showroom)
                          }}
                          className='text-orange-600 hover:text-orange-900'
                        >
                          Edit
                          <span className='sr-only'>, {showroom?.name}</span>
                        </button>
                      </td>
                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-red-600 hover:text-red-900 cursor-pointer'>
                        <button
                          onClick={() => {
                            setForm('ShowroomDeleteForm')
                            setIsOpen(true)
                            setDeleteId(showroom)
                          }}
                          className='text-red-600 hover:text-red-500 cursor-pointer'
                        >
                          Delete
                          <span className='sr-only'>, {showroom?.name}</span>
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

export default AdminShowrooms
