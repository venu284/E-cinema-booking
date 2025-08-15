import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'
import Loader from '../../../../src/components/Reusables/Loader'
import { Header } from '../../../../src/components/Reusables/Header'
import { ToggleButton } from '../../../../src/components/Reusables/Forms/ToggleButton'
import { mutate } from 'swr'
import { useUser } from '../../../../src/lib/hooks'
import { getSelected, stateOptions } from '../../../../src/lib/helper'
import { DropDown } from '../../../../src/components/Reusables/Forms/Dropdown'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const ProfileEdit = ({ userDetails }) => {
  const user = useUser()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profile, setProfile] = useState({
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    image: userDetails?.image,
    phone: userDetails?.phone,
    enabledPromotions: userDetails?.enabledPromotions,
    status: userDetails?.status,
    category: userDetails?.category
  })

  const [address, setAddress] = useState({
    street: userDetails?.address?.street,
    city: userDetails?.address?.city,
    zipcode: userDetails?.address?.zipCode
  })

  const [selectedState, setSelectedState] = useState(
    userDetails?.address?.state
      ? getSelected(stateOptions, userDetails?.address?.state)
      : stateOptions[0]
  )

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setProfile({
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      image: userDetails?.image,
      phone: userDetails?.phone,
      enabledPromotions: userDetails?.enabledPromotions,
      status: userDetails?.status,
      category: userDetails?.category
    })
    setAddress({
      street: userDetails?.address?.street,
      city: userDetails?.address?.city,
      zipcode: userDetails?.address?.zipCode
    })
    setSelectedState(
      userDetails?.address?.state
        ? getSelected(stateOptions, userDetails?.address?.state)
        : stateOptions[0]
    )
  }, [userDetails])

  const uploadFileHandler = async e => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ukne2ozw')
    try {
      setLoading(true)
      const uploadRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dpxtcfdt1/image/upload',
        formData
      )
      setLoading(false)
      const { url } = uploadRes.data
      setProfile({ ...profile, image: url })
    } catch (error) {
      toast.error(error, { toastId: error })
    }
  }

  const handleSubmitPassword = async e => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { toastId: 'password-match-error' })
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(`/api/auth/changepassword`, {
        email: userDetails?.email,
        currentPassword: password,
        newPassword: confirmPassword
      })

      const { message } = response.data

      if (message === 'Password changed successfully') {
        toast.success(message, { toastId: 'password-changed' })
      } else {
        toast.error(message, { toastId: 'password-change-error' })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Something went wrong. Please try again.', {
        toastId: 'password-change-failure'
      })
    } finally {
      setLoading(false)
    }
  }

  const submitHandler = async e => {
    e.preventDefault()
    const {
      data: { message }
    } = await axios.put(`/api/user/userdetails?userId=${userDetails?._id}`, {
      profile,
      address: {
        ...address,
        zipCode: Number(address?.zipcode),
        state: selectedState?.name
      }
    })
    if (message == 'Details Updated') {
      toast.success(message, { toastId: message })
      router.push(`/dashboard/profile/${userDetails?._id}`)
      mutate('/api/user')
    } else {
      toast.error(message, { toastId: message })
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Cinema Booking System | Profile Edit</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header heading={'Edit Profile'} />
      <main
      className="relative -mt-40 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/background.jpg')"
      }}
    >
      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md text-white rounded-2xl shadow-xl p-8">
            <form
              onSubmit={submitHandler}
              className='max-w-5xl mx-auto space-y-8 divide-y divide-gray-200 px-10'
            >
              <div className='space-y-6 sm:space-y-5'>
                <div>
                  <h3 className='text-lg leading-6 font-medium text-gray-200'>
                    Personal Information
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-200'>
                    Use information that can be displayed on your profile.
                  </p>
                </div>
                <div className='space-y-6 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='firstName'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      First name
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='text'
                        name='firstName'
                        id='firstName'
                        value={profile?.firstName}
                        onChange={e =>
                          setProfile({
                            ...profile,
                            firstName: e.target.value
                          })
                        }
                        autoComplete='given-name'
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='lastName'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      Last name
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='text'
                        name='lastName'
                        id='lastName'
                        value={profile?.lastName}
                        onChange={e =>
                          setProfile({
                            ...profile,
                            lastName: e.target.value
                          })
                        }
                        autoComplete='family-name'
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='registered-email'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      Email address
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        id='registered-email'
                        name='registered-email'
                        type='email'
                        value={userDetails?.email || ''}
                        disabled={user?.category != 'admin'}
                        className={`${
                          user?.category != 'admin' &&
                          'bg-gray-200 cursor-not-allowed'
                        } bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500`}
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      Phone Number
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='text'
                        name='phone'
                        id='phone'
                        value={profile?.phone}
                        onChange={e =>
                          setProfile({
                            ...profile,
                            phone: e.target.value
                          })
                        }
                        autoComplete='tel'
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='promotions'
                      className='block text-sm font-medium text-gray-200 sm:mt-px '
                    >
                      Promotions
                    </label>
                    <div className='sm:mt-0 sm:col-span-2'>
                      <ToggleButton
                        enabled={profile.enabledPromotions}
                        setEnabled={() =>
                          setProfile(prevProfile => ({
                            ...prevProfile,
                            enabledPromotions: !prevProfile.enabledPromotions
                          }))
                        }
                      />
                    </div>
                  </div>

                  {user?.category === 'admin' && (
                    <>
                      <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                        <label
                          htmlFor='phone'
                          className='block text-sm font-medium text-gray-200 sm:mt-px'
                        >
                          Account Status
                        </label>
                        <div className='sm:mt-0 sm:col-span-2'>
                          <ToggleButton
                            enabled={profile.status}
                            setEnabled={() =>
                              setProfile(prevProfile => ({
                                ...prevProfile,
                                status: !prevProfile.status
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                        <label
                          htmlFor='phone'
                          className='block text-sm font-medium text-gray-200 sm:mt-px'
                        >
                          Admin
                        </label>
                        <div className='sm:mt-0 sm:col-span-2'>
                          <ToggleButton
                            enabled={profile.category === 'admin'}
                            setEnabled={() =>
                              setProfile(prevProfile => ({
                                ...prevProfile,
                                category:
                                  prevProfile.category === 'admin'
                                    ? 'user'
                                    : 'admin'
                              }))
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className='pt-8 space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                <div>
                  <h3 className='text-lg leading-6 font-medium text-gray-200'>
                    Password
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-200'>
                    Use this to change password.
                  </p>
                </div>
                <div className='space-y-6 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='currentPassword'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      Current Password
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='password'
                        name='currentPassword'
                        id='currentPassword'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='newPassword'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      New Password
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='password'
                        name='newPassword'
                        id='newPassword'
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='confirmPassword'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      Confirm New Password
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='password'
                        name='confirmPassword'
                        id='confirmPassword'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='pt-5'>
                    <div className='flex justify-end'>
                      <button
                        onClick={handleSubmitPassword}
                        type='submit'
                        disabled={loading}
                        className={`${
                          loading ? 'cursor-not-allowed' : ''
                        } ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700`}
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='pt-8 space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                <div>
                  <div>
                    <h3 className='text-lg leading-6 font-medium text-gray-200'>
                      Profile
                    </h3>
                    <p className='mt-1 max-w-2xl text-sm text-gray-200'>
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>

                  <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='photo'
                        className='block text-sm font-medium text-gray-200'
                      >
                        Photo
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2 '>
                        {loading ? (
                          <div className='animate-pulse'>
                            <input className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            ></input>
                          </div>
                        ) : (
                          <input
                            type='text'
                            value={profile?.image}
                            disabled={true}
                            onChange={e =>
                              setProfile({ ...profile, image: e.target.value })
                            }
                            className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                          />
                        )}
                        {loading ? (
                          <div className='inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-gray-200 cursor-not-allowed'>
                            <Loader height='8' width='8' color='gray' />
                            Please Wait...
                          </div>
                        ) : (
                          <input
                            className='mt-2 appearance-none block w-3/4 p-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                            label='Choose File'
                            type='file'
                            name='image'
                            id='profileImg'
                            onChange={uploadFileHandler}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='pt-8 space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                <div>
                  <h3 className='text-lg leading-6 font-medium text-gray-200'>
                    Address
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-200'>
                    Use a permanent address where you can receive mail.
                  </p>
                </div>
                <div className='space-y-6 sm:space-y-5'>
                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='street'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      Street
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='text'
                        name='street'
                        id='street'
                        autoComplete='address-line1'
                        value={address?.street}
                        onChange={e =>
                          setAddress({
                            ...address,
                            street: e.target.value
                          })
                        }
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='city'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      City
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='text'
                        name='city'
                        id='city'
                        value={address?.city}
                        onChange={e =>
                          setAddress({
                            ...address,
                            city: e.target.value
                          })
                        }
                        autoComplete='address-level2'
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='zipCode'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      Zip Code
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-2'>
                      <input
                        type='text'
                        name='zipCode'
                        id='zipCode'
                        value={address?.zipcode}
                        onChange={e => {
                          setAddress({ ...address, zipcode: e.target.value })
                        }}
                        autoComplete='postal-code'
                        className="bg-white/10 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                    <label
                      htmlFor='registered-email'
                      className='block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2'
                    >
                      State
                    </label>
                    <div className='mt-1 sm:mt-0 sm:col-span-1'>
                      <DropDown
                        title={'State'}
                        options={stateOptions}
                        selectedOption={selectedState}
                        setSelectedOption={setSelectedState}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='pt-5'>
                <div className='flex justify-end'>
                  <Link href={`/dashboard/profile/${userDetails?._id}`}>
                    <button
                      type='button'
                      className="bml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                    >
                      Cancel
                    </button>
                  </Link>
                  <button
                    onClick={submitHandler}
                    type='submit'
                    disabled={loading}
                    className={`${
                      loading ? 'cursor-not-allowed' : ''
                    } ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </React.Fragment>
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

  if (!user?.isVerified) {
    return {
      redirect: {
        destination: `/auth/verify`,
        permanent: false
      }
    }
  }

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/user/singleUserdetails?userId=${query.id}`
  )

  return {
    props: {
      userDetails: data?.userdetails ?? null
    }
  }
}

export default ProfileEdit
