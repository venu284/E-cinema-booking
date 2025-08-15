import React, { useState } from 'react'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'
import Link from 'next/link'
import Head from 'next/head'
import { PencilIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { Profile } from '../../../../src/components/Profile'
import { Bookings } from '../../../../src/components/Bookings'
import { Cards } from '../../../../src/components/Cards'
import { Address } from '../../../../src/components/Address'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const UserProfile = ({ userDetails }) => {
  const [tab, setTab] = useState('profile')

  return (
    <React.Fragment>
      <Head>
        <title>Cinema Booking System | Profile</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Main */}
      <main
        className='min-h-screen bg-cover bg-center'
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className='flex justify-center px-4 py-10'>
          <div className='w-full max-w-5xl bg-black/60 backdrop-blur-md text-white rounded-2xl shadow-xl'>
            {/* Cover Image */}
            <img
              className='h-32 w-full object-cover lg:h-48 rounded-md'
              src='https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
              alt='cover-image'
            />

            {/* Profile Header */}
            <div className='-mt-24 sm:flex sm:items-end sm:space-x-5'>
              <div className='flex'>
                <img
                  className='h-48 w-48 rounded-full ring-4 ring-white object-cover cursor-pointer'
                  src={userDetails?.image}
                  alt='profile-image'
                />
              </div>
              <div className='mt-6 sm:flex-1 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
                <div className='sm:hidden 2xl:block mt-6 min-w-0 flex-1'>
                  <h1 className='text-2xl font-bold text-white truncate'>
                    {userDetails?.firstName} {userDetails?.lastName}
                  </h1>
                </div>
                <div className='mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
                  <Link href={`/dashboard/profile/${userDetails?._id}/edit`}>
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700'
                    >
                      <PencilIcon
                        className='-ml-1 mr-2 h-5 w-5 text-white'
                        aria-hidden='true'
                      />
                      <span>Edit Profile</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Name for smaller screens */}
            <div className='hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1'>
              <h1 className='text-2xl font-bold text-white truncate'>
                {userDetails?.firstName} {userDetails?.lastName}
              </h1>
            </div>

            {/* Tabs */}
            <div className='mt-10 border-b border-gray-700'>
              <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
                <button
                  onClick={() => setTab('profile')}
                  className={classNames(
                    tab === 'profile'
                      ? 'border-orange-400 text-white'
                      : 'border-transparent text-gray-200 hover:text-white hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md'
                  )}
                >
                  Profile
                </button>
                <button
                  onClick={() => setTab('address')}
                  className={classNames(
                    tab === 'address'
                      ? 'border-orange-400 text-white'
                      : 'border-transparent text-gray-200 hover:text-white hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md'
                  )}
                >
                  Your Address
                </button>
                <button
                  onClick={() => setTab('bookings')}
                  className={classNames(
                    tab === 'bookings'
                      ? 'border-orange-400 text-white'
                      : 'border-transparent text-gray-200 hover:text-white hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md'
                  )}
                >
                  Your Bookings
                </button>
                <button
                  onClick={() => setTab('cards')}
                  className={classNames(
                    tab === 'cards'
                      ? 'border-orange-400 text-white'
                      : 'border-transparent text-gray-200 hover:text-white hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md'
                  )}
                >
                  Your Cards
                </button>
              </nav>
            </div>

            {/* Content with white text */}
            <div className='mt-6 text-white space-y-8'>
              {tab === 'profile' && (
                <div className='text-white'>
                  <Profile userDetails={userDetails} />
                </div>
              )}
              {tab === 'address' && (
                <div className='text-white'>
                  <Address userDetails={userDetails} />
                </div>
              )}
              {tab === 'cards' && (
                <div className='text-white'>
                  <Cards userDetails={userDetails} />
                </div>
              )}
              {tab === 'bookings' && (
                <div className='text-white'>
                  <Bookings userDetails={userDetails} />
                </div>
              )}
            </div>
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

export default UserProfile
