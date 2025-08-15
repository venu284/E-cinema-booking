import React, { useState } from 'react'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'
import { Heading } from '../../../../src/components/Reusables/Heading'
import { useModalContext } from '../../../../src/context/ModalContext'
import { useAllUserDetails } from '../../../../src/hooks/useAllUserDetails'
import { Switch } from '@headlessui/react'
import axios from 'axios'
import { mutate } from 'swr'
import { toast } from 'react-toastify'
import Link from 'next/link'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const AdminUsers = () => {
  const { users, isLoading } = useAllUserDetails()
  const [loading, setLoading] = useState(true)
  const { setForm, setDeleteId, setIsOpen } = useModalContext()

  const handleChange = async userDetails => {
    setLoading(true)
    const profile = {
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      image: userDetails?.image,
      phone: userDetails?.phone,
      enabledPromotions: userDetails?.enabledPromotions,
      status: !userDetails?.status
    }
    const address = {
      street: userDetails?.address?.street,
      city: userDetails?.address?.city,
      zipcode: userDetails?.address?.zipCode
    }

    const { data } = await axios.put(
      `/api/user/userdetails/?userId=${userDetails?._id}`,
      {
        profile,
        address
      }
    )
    if (data.message === 'Details Updated') {
      mutate('/api/user/userdetails')
      toast.success(data.message)
    } else {
      toast.success(data.message, {
        toastId: data.message
      })
    }
    setLoading(false)
  }

  return (
    <div className='mt-[10vh]'>
      <Heading title={'Users'} href={'/dashboard/admin/users/add'} />

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
                      User Id
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      First Name
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Last Name
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Email
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Admin
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-700'
                    >
                      Status
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
                  {users?.map(user => (
                    <tr key={user?._id}>
                      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6'>
                        {user?._id}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {user?.firstName}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {user?.lastName}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {user?.email}
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {user?.category == 'admin' ? 'True' : 'False'}
                      </td>

                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        {user?.status ? 'Active' : 'In-active'}
                      </td>
                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                        <Switch
                          checked={user?.status}
                          onChange={e => handleChange(user)}
                          className={classNames(
                            user?.status ? 'bg-orange-600' : 'bg-gray-200',
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                          )}
                        >
                          <span className='sr-only'>Use setting</span>
                          <span
                            className={classNames(
                              user?.status ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                            )}
                          >
                            <span
                              className={classNames(
                                user?.status
                                  ? 'opacity-0 ease-out duration-100'
                                  : 'opacity-100 ease-in duration-200',
                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                              )}
                              aria-hidden='true'
                            >
                              <svg
                                className='h-3 w-3 text-gray-400'
                                fill='none'
                                viewBox='0 0 12 12'
                              >
                                <path
                                  d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                                  stroke='currentColor'
                                  strokeWidth={2}
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                            </span>
                            <span
                              className={classNames(
                                user?.status
                                  ? 'opacity-100 ease-in duration-200'
                                  : 'opacity-0 ease-out duration-100',
                                'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                              )}
                              aria-hidden='true'
                            >
                              <svg
                                className='h-3 w-3 text-orange-600'
                                fill='currentColor'
                                viewBox='0 0 12 12'
                              >
                                <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                              </svg>
                            </span>
                          </span>
                        </Switch>
                      </td>
                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
                        <Link
                          href={`/dashboard/profile/${user?._id}/edit`}
                          className='text-orange-600 hover:text-orange-900'
                        >
                          Edit<span className='sr-only'>, {user?.name}</span>
                        </Link>
                      </td>
                      <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-red-600 hover:text-red-900 cursor-pointer'>
                        <button
                          disabled={user?.status}
                          onClick={() => {
                            setForm('DeleteUserFormModal')
                            setIsOpen(true)
                            setDeleteId(user)
                          }}
                          className={`${
                            !user?.status
                              ? 'text-red-600 hover:text-red-500 cursor-pointer'
                              : 'text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          Delete<span className='sr-only'>, {user?.name}</span>
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

export default AdminUsers
