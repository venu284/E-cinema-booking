import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { BookingConfirmation } from '../src/components/Movie/BookingConfirmation'
import { useUser } from '../src/lib/hooks'
import { getLoginSession } from '../src/lib/auth'
import { findUser } from '../src/lib/user'

const Confirmation = () => {
  const router = useRouter()
  const user = useUser()
  const { bookingId } = router.query

  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bookingId) return

    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `/api/bookings/${bookingId}?userId=${user?._id}`
        )

        setBooking(response.data.booking)
      } catch (error) {
        console.error('Error fetching booking:', error)
        setError('Failed to load booking details.')
      }
    }

    fetchBooking()
  }, [bookingId])

  if (error) {
    return <div className='text-red-500 mt-[10vh]'>{error}</div>
  }

  if (!booking) {
    return <div className='mt-[10vh]'>Loading...</div>
  }

  return (
    <div className='min-h-screen bg-gray-900 py-10'>
      <div className='max-w-4xl mx-auto px-4'>
        <BookingConfirmation booking={booking} />
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

export default Confirmation
