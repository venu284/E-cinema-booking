import React from 'react'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'
import { Heading } from '../../../../src/components/Reusables/Heading'
import Link from 'next/link'
import { useModalContext } from '../../../../src/context/ModalContext'
import { useAllPromotionDetails } from '../../../../src/hooks/useAllPromotionDetails'
import axios from 'axios'
import { toast } from 'react-toastify'
import { mutate } from 'swr'

const AdminPromotions = () => {
  const { promotions, isLoading } = useAllPromotionDetails()
  const { setForm, setDeleteId, setIsOpen } = useModalContext()

  const handleSendPromotion = async promotionId => {
    try {
      const response = await axios.post(`/api/promotions/`, { promotionId })
      if (response.data.success) {
        toast.success('Promotion sent successfully!')
        mutate('/api/promotions/')
      } else {
        toast.error('Failed to send promotion.')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while sending the promotion.')
    }
  }

  return (
    <div className='mt-[10vh]'>
      <Heading
        title={'Promotions'}
        button={'Add Promotion'}
        href={'/dashboard/admin/promotions/add'}
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
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Discount Rate
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Start Date
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      End Date
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Selected Movies
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Code
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Draft
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {promotions?.map(promotion => (
                    <tr key={promotion?._id}>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {promotion?.name}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {promotion?.discountRate}%
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {new Date(
                          promotion?.promotionStartDate
                        ).toLocaleDateString('en-US')}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {new Date(
                          promotion?.promotionEndDate
                        ).toLocaleDateString('en-US')}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {promotion?.selectedMovies?.length}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {promotion?.code}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {promotion?.status === 'Draft' ? 'True' : 'False'}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex space-x-4'>
                        {/* Edit Button */}
                        <Link
                          href={`/dashboard/admin/promotions/${promotion?._id}/edit`}
                        >
                          <button
                            disabled={promotion?.isSent}
                            className={`text-orange-600 hover:text-orange-900 ${
                              promotion?.isSent
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            Edit
                          </button>
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setForm('DeletePromotionFormModal')
                            setIsOpen(true)
                            setDeleteId(promotion)
                          }}
                          className={`text-red-600 hover:text-red-900`}
                        >
                          Delete
                        </button>

                        {/* Send Promotion Button */}
                        {!promotion?.isSent && (
                          <button
                            onClick={() => handleSendPromotion(promotion?._id)}
                            className='text-green-600 hover:text-green-900'
                          >
                            Send Promotion
                          </button>
                        )}

                        {/* Promotion Sent Indicator */}
                        {promotion?.isSent && (
                          <span className='text-gray-500'>Promotion Sent</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && (
                <div className='p-4 text-center text-gray-500'>
                  Loading promotions...
                </div>
              )}
              {promotions?.length === 0 && !isLoading && (
                <div className='p-4 text-center text-gray-500'>
                  No promotions found.
                </div>
              )}
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

export default AdminPromotions
