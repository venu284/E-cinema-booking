import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { getLoginSession } from '../../src/lib/auth'
import { findUser } from '../../src/lib/user'
import { Loading } from '../../src/components/Reusables/Loading'
import { useModalContext } from '../../src/context/ModalContext'

export default function Example () {
  const { loading, setLoading } = useModalContext()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [state, setState] = useState('')
  const router = useRouter()

  const handleSubmitEmail = async e => {
    e.preventDefault()
    setLoading(true)
    const {
      data: { message }
    } = await axios.get(`/api/auth/forgotpassword/?email=${email}`)
    setLoading(false)
    if (message === 'OTP has sent to your email') {
      setState('otp')
      toast.success(message, {
        toastId: message
      })
    } else {
      toast.error(message, {
        toastId: message
      })
    }
  }
  const handleSubmitOtp = async e => {
    e.preventDefault()
    setLoading(true)
    const {
      data: { message }
    } = await axios.post(`/api/auth/forgotpassword/?email=${email}&otp=${otp}`)
    setLoading(false)
    if (message === 'You have entered correct OTP') {
      setState('password')
      toast.success(message, {
        toastId: message
      })
    } else {
      toast.error(message, {
        toastId: message
      })
    }
  }
  const handleSubmitPassword = async e => {
    e.preventDefault()
    if (password === confirmPassword) {
      setLoading(true)
      const {
        data: { message }
      } = await axios.put(
        `/api/auth/forgotpassword/?email=${email}&password=${password}`
      )
      setLoading(false)
      if (message === 'Password Updated') {
        router.push('/auth/login')
        toast.success(message, {
          toastId: message
        })
      } else {
        toast.error(message, {
          toastId: message
        })
      }
    } else {
      toast.error('Match your passwords', {
        toastId: 'Match your passwords'
      })
    }
  }
  return (
    <div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      {/* {loading && <Loading />} */}
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='relative w-40 h-16 mx-auto'>
          <Image
            placeholder='blur'
            blurDataURL='/mylogo.png'
            layout='fill'
            objectFit='contain'
            className=''
            src='/mylogo.png'
            alt=''
          />
        </div>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-200'>
          Forgot Password
        </h2>
      </div>
      <div className='mt-3 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmitPassword} className='space-y-3'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-900'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  disabled={state !== ''}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`${
                    state !== '' ? 'bg-gray-100 cursor-not-allowed' : ''
                  } appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                />
              </div>
            </div>
            {state === 'otp' || state === 'password' ? (
              <div>
                <label
                  htmlFor='otp'
                  className='block text-sm font-medium text-gray-900'
                >
                  Enter OTP
                </label>
                <div className='mt-1'>
                  <input
                    id='otp'
                    name='otp'
                    type='text'
                    required
                    value={otp}
                    disabled={state !== 'otp'}
                    onChange={e => setOtp(e.target.value)}
                    className={`${
                      state !== 'otp' ? 'bg-gray-100 cursor-not-allowed' : ''
                    } appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                  />
                </div>
              </div>
            ) : (
              ''
            )}
            {state === '' && (
              <button
                onClick={handleSubmitEmail}
                className='mt-3 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 '
              >
                Submit Email Address
              </button>
            )}
            {state === 'otp' && (
              <button
                onClick={handleSubmitOtp}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 '
              >
                Submit OTP
              </button>
            )}
            {state === 'password' && (
              <>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-900'
                  >
                    New Password
                  </label>
                  <div className='mt-1'>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      autoComplete='current-password'
                      required
                      value={password}
                      disabled={state !== 'password'}
                      onChange={e => setPassword(e.target.value)}
                      className={`${
                        state !== 'password'
                          ? 'bg-gray-100 cursor-not-allowed'
                          : ''
                      } appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='confirm-password'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Confirm New Password
                  </label>
                  <div className='mt-1'>
                    <input
                      id='confirm-password'
                      name='confirm-password'
                      type='password'
                      autoComplete='current-password'
                      required
                      value={confirmPassword}
                      disabled={state !== 'password'}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={`${
                        state !== 'password'
                          ? 'bg-gray-100 cursor-not-allowed'
                          : ''
                      } appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                    />
                  </div>
                </div>
                <button
                  type='submit'
                  className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 '
                >
                  <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                    <LockClosedIcon
                      className='h-5 w-5 text-orange-500 group-hover:text-orange-400'
                      aria-hidden='true'
                    />
                  </span>
                  Update Password
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async function ({ req, res }) {
  const session = await getLoginSession(req)
  const user = (session?._doc && (await findUser(session._doc))) ?? null
  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
