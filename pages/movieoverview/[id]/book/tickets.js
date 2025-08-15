import Link from 'next/link'
import React from 'react'
import { TicketSelection } from '../../../../src/components/Movie/TicketSelection'
import { useMovieBookingContext } from '../../../../src/context/MovieBookingContext'
import Summary from '../../../../src/components/Movie/Summary'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'

const Tickets = () => {
  return (
    <div className='bg-gray-900 py-14'>
      <div className='mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8'>
        <div className='mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2'>
          <div className='flex p-px lg:col-span-4'>
            <div className='text-center w-full overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]'>
              <div className='p-10'>
                <h3 className='text-md uppercase tracking-wider font-semibold text-gray-400'>
                  Your Tickets
                </h3>
                <TicketSelection />
              </div>
            </div>
          </div>
          <div className='flex p-px lg:col-span-2'>
            <div className='w-full overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 lg:rounded-tr-[2rem]'>
              <div className='p-10'>
                <Summary />
              </div>
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

export default Tickets
