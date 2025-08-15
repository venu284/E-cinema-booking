import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getLoginSession } from '../../src/lib/auth'
import { findUser } from '../../src/lib/user'
import { useRouter } from 'next/router'

const VerifyAccount = ({ user }) => {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(10)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const email = user?.email

  useEffect(() => {
    let timer
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  useEffect(() => {
    if (!email) return
    const sendOTP = async () => {
      try {
        const response = await axios.post('/api/auth/verify/send-otp', {
          email
        })
        if (response.data.success) {
          setMessage({
            type: 'success',
            text: 'OTP has been sent to your email.'
          })
          setResendTimer(10)
        } else {
          setMessage({ type: 'error', text: response.data.message })
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'An error occurred while sending OTP.'
        })
      }
    }

    if (email) {
      sendOTP()
    }
  }, [email])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await axios.post('/api/auth/verify/verify-otp', {
        email,
        otp
      })

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Your account has been verified!'
        })
        router.push('/')
      } else {
        setMessage({ type: 'error', text: response.data.message })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred during verification.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await axios.post('/api/send-otp', {
        email
      })

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'OTP has been resent to your email.'
        })
        setResendTimer(10)
      } else {
        setMessage({ type: 'error', text: response.data.message })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred while resending OTP.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='max-w-md w-full bg-white p-8 rounded shadow'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Verify Your Account
        </h2>
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : message.type === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {message.text}
          </div>
        )}
        {email ? (
          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label htmlFor='otp' className='block text-gray-900 mb-2'>
                OTP:
              </label>
              <input
                type='text'
                name='otp'
                id='otp'
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className='w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
                placeholder='Enter the OTP sent to your email'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 transition-colors disabled:opacity-50'
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        ) : (
          <p className='text-center text-gray-900'>
            Loading your verification details...
          </p>
        )}

        {email && (
          <div className='mt-4 text-center'>
            <p className='text-gray-600'>Didn't receive the OTP?</p>
            <button
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || loading}
              className='mt-2 text-orange-600 hover:underline disabled:text-gray-400'
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyAccount

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

  if (user?.isVerified) {
    return {
      redirect: {
        destination: `/`,
        permanent: false
      }
    }
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user))
    }
  }
}
