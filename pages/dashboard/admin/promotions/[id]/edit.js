import React, { useState } from 'react'
import { Header } from '../../../../../src/components/Reusables/Header'
import { DropDown } from '../../../../../src/components/Reusables/Forms/Dropdown'
import { getSelected, statusOptions } from '../../../../../src/lib/helper'
import { CheckBox } from '../../../../../src/components/Reusables/Forms/CheckBox'
import { toast } from 'react-toastify'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getLoginSession } from '../../../../../src/lib/auth'
import { findUser } from '../../../../../src/lib/user'
import { mutate } from 'swr'
import { useAllMovieDetails } from '../../../../../src/hooks/useAllMovieDetails'

const PromotionEdit = ({ promotionDetails }) => {
  const router = useRouter()
  const { movies } = useAllMovieDetails()
  const [status, setStatus] = useState(
    getSelected(statusOptions, promotionDetails?.status)
  )
  const [description, setDescription] = useState(promotionDetails?.description)
  const [loading, setLoading] = useState({ type: '', status: false })
  const [code, setCode] = useState(promotionDetails?.code)
  const [from, setFrom] = useState(
    promotionDetails?.promotionStartDate || new Date().toISOString()
  )
  const [selectedMovies, setSelectedMovies] = useState(
    promotionDetails?.selectedMovies
  )
  const [to, setTo] = useState(
    promotionDetails?.promotionEndDate || new Date().toISOString()
  )
  const [name, setName] = useState(promotionDetails?.name)
  const [discountRate, setDiscountRate] = useState(
    promotionDetails?.discountRate
  )

  const onSubmitHandler = async e => {
    e.preventDefault()

    setLoading({ type: 'edit', status: true })

    const {
      data: { message }
    } = await axios.put(`/api/promotions/promotiondetails`, {
      ...promotionDetails,
      name,
      description,
      promotionStartDate: from,
      promotionEndDate: to,
      code,
      discountRate,
      selectedMovies,
      status: status?.name
    })

    setLoading({ type: 'edit', status: false })

    if (message == 'Promotion Updated') {
      toast.success(message, { toastId: message })
      mutate('/api/promotions')
      router.push('/dashboard/admin/promotions')
    } else {
      toast.error(message, { toastId: message })
    }
  }

  return (
    <div>
      <Header heading={'Edit Promotion'} />
      <main className='relative -mt-40'>
        <div className='space-y-6 max-w-7xl mx-auto py-8'>
          <div className='bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6'>
            <div className='mb-5 md:col-span-1'>
              <h3 className='text-lg font-medium leading-6 text-gray-700'>
                Promotion Infomation
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
            <div>
              <form
                className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'
                method='POST'
              >
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Promotion Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={name}
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>
                <div className='sm:col-span-4'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-900  '
                  >
                    Description
                  </label>
                  <input
                    type='text'
                    name='description'
                    id='description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='startDate'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Promotion Start Date
                  </label>
                  <div className='mt-1'>
                    <input
                      type='datetime-local'
                      name='startDate'
                      id='startDate'
                      value={from.substring(0, 16)}
                      onChange={e => setFrom(e.target.value)}
                      required
                      className='shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='endDate'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Promotion End Date
                  </label>
                  <div className='mt-1'>
                    <input
                      type='datetime-local'
                      name='endDate'
                      id='endDate'
                      required
                      value={to.substring(0, 16)}
                      onChange={e => setTo(e.target.value)}
                      className='shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='code'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Promotion Code
                  </label>
                  <input
                    type='text'
                    name='code'
                    id='code'
                    value={code}
                    onChange={e => {
                      setCode(e.target.value)
                    }}
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>

                <div className='sm:col-span-6 rounded border'>
                  <h4 className='font-semibold text-sm bg-gray-100 px-2 py-3 flex'>
                    <p>{'Movies'}</p>
                    <div className='ml-3 flex items-center font-normal'>
                      <input
                        type='checkbox'
                        className='h-4 w-4 mr-1 text-orange-600 border-gray-300 rounded outline-none'
                        checked={selectedMovies.length === movies?.length}
                        onChange={() => {
                          if (selectedMovies.length === movies.length)
                            setSelectedMovies([])
                          else setSelectedMovies([...movies.map(x => x._id)])
                        }}
                      />
                      <label>All Options</label>
                    </div>
                  </h4>
                  <CheckBox
                    options={movies}
                    setCheckedOptions={setSelectedMovies}
                    checkedOptions={selectedMovies}
                  />
                </div>

                {/* <div className='sm:col-span-3'>
                    <Variations
                      title='Ticket Price'
                      handleExtraOptions={extra =>
                        setVariations({
                          ...variations,
                          prices: [...variations.prices, extra]
                        })
                      }
                      deleteOption={option =>
                        setVariations({
                          ...variations,
                          prices: variations.prices.filter(
                            x =>
                              x.name !== option.name || x.price !== option.price
                          )
                        })
                      }
                      extraOptions={variations.prices}
                    />
                  </div> */}

                <div className='sm:col-span-3'>
                  <label
                    htmlFor='discountRate'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Discount Rate
                  </label>
                  <input
                    type='text'
                    name='discountRate'
                    id='discountRate'
                    value={discountRate}
                    onChange={e => setDiscountRate(e.target.value)}
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>

                <div className='sm:col-span-2 relative -top-6'>
                  <DropDown
                    title={'Status'}
                    options={statusOptions}
                    selectedOption={status}
                    setSelectedOption={setStatus}
                  />
                </div>
              </form>

              <div className='flex justify-end'>
                <Link href={`/dashboard/admin/movies`}>
                  <button
                    type='button'
                    className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  disabled={loading?.status}
                  onClick={onSubmitHandler}
                  className={`${
                    loading?.status
                      ? 'cursor-not-allowed'
                      : 'hover:bg-orange-700 '
                  } ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
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

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/promotions/promotiondetails?promotionId=${query.id}`
  )

  return {
    props: {
      promotionDetails: data?.promotionDetails
    }
  }
}

export default PromotionEdit
