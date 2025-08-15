import React, { useEffect, useState } from 'react'
import { Header } from '../../../../src/components/Reusables/Header'
import { DropDown } from '../../../../src/components/Reusables/Forms/Dropdown'
import {
  certificateOptions,
  genreOptions,
  statusOptions
} from '../../../../src/lib/helper'
import Editor from '../../../../src/components/Reusables/Forms/Editor'
import Loader from '../../../../src/components/Reusables/Loader'
import { CheckBox } from '../../../../src/components/Reusables/Forms/CheckBox'
import { Variations } from '../../../../src/components/Reusables/Variations'
import { toast } from 'react-toastify'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { getLoginSession } from '../../../../src/lib/auth'
import { findUser } from '../../../../src/lib/user'
import { useAllShowroomDetails } from '../../../../src/hooks/useAllShowroomDetails'

const MovieAdd = () => {
  const { showrooms: showRoomOptions } = useAllShowroomDetails()
  const router = useRouter()
  const [selectedCertificate, setSelectedCertificate] = useState(
    certificateOptions[0]
  )
  const [status, setStatus] = useState(statusOptions[0])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState({ type: '', status: false })
  const [logo, setLogo] = useState('')
  const [from, setFrom] = useState(new Date().toISOString())
  const [genre, setGenre] = useState([])
  const [to, setTo] = useState(new Date().toISOString())
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [trailer, setTrailer] = useState('')
  const [movieTimings, setMovieTimings] = useState([])
  const [variations, setVariations] = useState({
    cast: []
  })
  const [ticketPrices, setTicketPrices] = useState({
    adult: 0.0,
    child: 0.0,
    senior: 0.0
  })

  const [newMovieTimingInput, setNewMovieTimingInput] = useState('')

  const [selectedShowroom, setSelectedShowroom] = useState(null)

  useEffect(() => {
    if (showRoomOptions && showRoomOptions.length > 0) {
      setSelectedShowroom(showRoomOptions[0])
    }
  }, [showRoomOptions])

  const uploadFileHandler = async (e, type) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ukne2ozw')
    try {
      setLoading({ type: 'logo', status: true })
      const uploadRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dpxtcfdt1/image/upload',
        formData
      )
      setLoading({ type: 'logo', status: false })
      const { url } = uploadRes.data
      setLogo(url)
    } catch (error) {
      toast.error(error.message || 'Image upload failed', { toastId: error })
    }
  }

  const handleCallBack = data => {
    setDescription(data)
  }

  const formatDate = isoString => {
    if (!isoString) return 'Invalid Date'

    const date = new Date(isoString)

    if (isNaN(date.getTime())) return 'Invalid Date'

    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const extractDateOnly = isoString => {
    if (!isoString) return ''

    const date = new Date(isoString)

    if (isNaN(date.getTime())) return ''

    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const groupTimingsByDate = timings => {
    const grouped = timings.reduce((acc, timing) => {
      const extractedDate = extractDateOnly(timing.date)

      if (!acc[extractedDate]) {
        acc[extractedDate] = []
      }
      acc[extractedDate].push(timing)

      return acc
    }, {})

    return Object.keys(grouped).map(date => ({
      date,
      timings: grouped[date]
    }))
  }

  const handleAddMovieTiming = () => {
    const dateTimeValue = newMovieTimingInput

    if (!dateTimeValue) {
      toast.warn('Please select a date and time.')
      return
    }

    const dateTime = dateTimeValue.split('T')
    if (dateTime.length < 2) {
      toast.warn('Invalid date and time format.')
      return
    }

    const [date, time] = dateTime

    if (!date || !time) {
      toast.warn('Please provide both date and time.')
      return
    }

    if (!selectedShowroom) {
      toast.warn('Please select a showroom.')
      return
    }

    if (!duration || isNaN(Number(duration))) {
      toast.warn('Please provide a valid movie duration in minutes.')
      return
    }

    const newMovieStartTime = new Date(`${date}T${time}`)
    const newMovieEndTime = new Date(
      newMovieStartTime.getTime() + Number(duration) * 60000
    )

    const overlappingTiming = movieTimings.find(timing => {
      const existingStartTime = new Date(`${timing.date}T${timing.time}`)
      const existingEndTime = new Date(
        existingStartTime.getTime() + Number(duration) * 60000
      )

      return (
        timing.showroom === selectedShowroom._id &&
        ((newMovieStartTime >= existingStartTime &&
          newMovieStartTime < existingEndTime) ||
          (newMovieEndTime > existingStartTime &&
            newMovieEndTime <= existingEndTime) ||
          (existingStartTime >= newMovieStartTime &&
            existingStartTime < newMovieEndTime))
      )
    })

    if (overlappingTiming) {
      toast.warn(
        'This timing conflicts with an existing schedule in the same showroom.'
      )
      return
    }

    const newMovieTiming = {
      date,
      time,
      showroom: selectedShowroom._id
    }

    setMovieTimings(prevTimings => [...prevTimings, newMovieTiming])
    setNewMovieTimingInput('')
    setSelectedShowroom(showRoomOptions[0])
    toast.success('Movie timing added successfully!')
  }

  const handleRemoveTiming = index => {
    setMovieTimings(prevTimings => prevTimings.filter((_, i) => i !== index))
  }

  const onSubmitHandler = async e => {
    e.preventDefault()

    if (!title || !description || !logo || !movieTimings.length) {
      toast.error('Please fill in all required fields.')
      return
    }

    setLoading({ type: 'add', status: true })

    const movieDetails = {
      title,
      cast: variations.cast,
      description,
      movieStartDate: from,
      movieEndDate: to,
      genre,
      image: logo,
      trailer,
      duration,
      certificate: selectedCertificate?.name,
      status: status?.name,
      movieTimings,
      ticketPrices
    }

    console.log(movieDetails)

    try {
      const response = await axios.post(
        `/api/movies/moviedetails`,
        movieDetails
      )
      const { message } = response.data

      setLoading({ type: 'add', status: false })

      if (message === 'Success! Movie and Timings Created') {
        toast.success(message)
        router.push('/dashboard/admin/movies')
      } else {
        toast.error(message)
      }
    } catch (error) {
      setLoading({ type: 'add', status: false })
      toast.error(error.response?.data?.message || error.message)
    }
  }

  if (!selectedShowroom) {
    return (
      <div>
        <Header heading={'Add Movie'} />
        <main className='relative -mt-40'>
          <div className='max-w-7xl mx-auto py-8 text-center'>
            <Loader height={50} width={50} color='gray' />
            <p>Loading showrooms, please wait...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Header heading={'Add Movie'} />
      <main className='relative -mt-40'>
        <div className='space-y-6 max-w-7xl mx-auto py-8'>
          <div className='bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6'>
            <div className='mb-5 md:col-span-1'>
              <h3 className='text-lg font-medium leading-6 text-gray-700'>
                Movie Information
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
                onSubmit={onSubmitHandler}
              >
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='title'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Movie Title
                  </label>
                  <input
                    type='text'
                    name='title'
                    id='title'
                    value={title}
                    onChange={e => {
                      setTitle(e.target.value)
                    }}
                    autoComplete='off'
                    required
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>
                <div className='sm:col-span-2 relative -top-[22px]'>
                  <DropDown
                    title={'Certificate'}
                    options={certificateOptions}
                    selectedOption={selectedCertificate}
                    setSelectedOption={setSelectedCertificate}
                  />
                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='duration'
                    className='block text-sm font-medium text-gray-900  '
                  >
                    Duration
                  </label>
                  <input
                    type='text'
                    name='duration'
                    id='duration'
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>

                <div className='sm:col-span-6'>
                  <label
                    htmlFor='purpose'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Description
                  </label>
                  <Editor input={description} dataCallBack={handleCallBack} />
                  <p className='mt-2 text-sm text-gray-500'>
                    Few lines to describe the movie.
                  </p>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='photo'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Image
                  </label>
                  <div className='mt-1'>
                    <div className='sm:mt-0 sm:col-span-2'>
                      {loading?.type === 'logo' && loading?.status ? (
                        <div className='animate-pulse'>
                          <input
                            className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-gray-200 sm:text-sm h-10'
                            disabled
                          />
                        </div>
                      ) : (
                        <input
                          type='text'
                          value={logo}
                          disabled={true}
                          onChange={e => setLogo(e.target.value)}
                          className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                        />
                      )}
                      {loading?.type === 'logo' && loading?.status ? (
                        <div className='inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-gray-500 cursor-not-allowed'>
                          <Loader height={6} width={6} color='gray' />
                          Please Wait...
                        </div>
                      ) : (
                        <input
                          className='mt-2 appearance-none block w-full p-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                          label='Choose File'
                          type='file'
                          name='image'
                          id='profileImg'
                          onChange={e => uploadFileHandler(e, 'logo')}
                          required
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='startDate'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Movie Start Date
                  </label>
                  <div className='mt-1'>
                    <input
                      type='datetime-local'
                      name='startDate'
                      id='startDate'
                      value={from}
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
                    Movie End Date
                  </label>
                  <div className='mt-1'>
                    <input
                      type='datetime-local'
                      name='endDate'
                      id='endDate'
                      required
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      className='shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                </div>

                <div className='sm:col-span-6 rounded border'>
                  <h4 className='font-semibold text-sm bg-gray-100 px-2 py-3 flex'>
                    <p>{'Genre'}</p>
                    <div className='ml-3 flex items-center font-normal'>
                      <input
                        type='checkbox'
                        className='h-4 w-4 mr-1 text-orange-600 border-gray-300 rounded outline-none'
                        checked={genre.length === genreOptions.length}
                        onChange={() => {
                          if (genre.length === genreOptions.length) setGenre([])
                          else setGenre([...genreOptions.map(x => x.name)])
                        }}
                      />
                      <label>All Options</label>
                    </div>
                  </h4>
                  <CheckBox
                    options={genreOptions}
                    setCheckedOptions={setGenre}
                    checkedOptions={genre}
                  />
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='trailer'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Trailer
                  </label>
                  <input
                    type='text'
                    name='trailer'
                    id='trailer'
                    value={trailer}
                    onChange={e => setTrailer(e.target.value)}
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>
                <div className='sm:col-span-1'>
                  <label
                    htmlFor='adultPrice'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Adult Price
                  </label>
                  <input
                    type='text'
                    name='adultPrice'
                    id='adultPrice'
                    value={ticketPrices?.adult}
                    onChange={e =>
                      setTicketPrices({
                        ...ticketPrices,
                        adult: e.target.value
                      })
                    }
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>
                <div className='sm:col-span-1'>
                  <label
                    htmlFor='childPrice'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Child Price
                  </label>
                  <input
                    type='text'
                    name='childPrice'
                    id='childPrice'
                    value={ticketPrices?.child}
                    onChange={e =>
                      setTicketPrices({
                        ...ticketPrices,
                        child: e.target.value
                      })
                    }
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>
                <div className='sm:col-span-1'>
                  <label
                    htmlFor='seniorPrice'
                    className='block text-sm font-medium text-gray-900'
                  >
                    Senior Price
                  </label>
                  <input
                    type='text'
                    name='seniorPrice'
                    id='seniorPrice'
                    value={ticketPrices?.senior}
                    onChange={e =>
                      setTicketPrices({
                        ...ticketPrices,
                        senior: e.target.value
                      })
                    }
                    autoComplete='off'
                    className='mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  />
                </div>

                <div className='sm:col-span-1 relative -top-6'>
                  <DropDown
                    title={'Status'}
                    options={statusOptions}
                    selectedOption={status}
                    setSelectedOption={setStatus}
                  />
                </div>

                <div className='sm:col-span-3 -mt-2'>
                  <Variations
                    title='Cast'
                    handleExtraOptions={extra =>
                      setVariations({
                        ...variations,
                        cast: [...variations.cast, extra]
                      })
                    }
                    deleteOption={option =>
                      setVariations({
                        ...variations,
                        cast: variations.cast.filter(
                          x =>
                            x.name !== option.name || x.value !== option.value
                        )
                      })
                    }
                    extraOptions={variations.cast}
                  />
                </div>

                {/* Movie Timings Section */}
                <div className='sm:col-span-6'>
                  <h4 className='text-md font-semibold mb-2'>Show Timings</h4>

                  <div className='flex flex-wrap gap-2 items-center mb-6'>
                    <input
                      type='datetime-local'
                      value={newMovieTimingInput}
                      onChange={e => setNewMovieTimingInput(e.target.value)}
                      className='shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:w-auto sm:flex-1 sm:text-sm border-gray-300 rounded-md'
                    />

                    <div className='w-full sm:w-auto'>
                      <DropDown
                        title={'Showroom'}
                        options={showRoomOptions}
                        selectedOption={selectedShowroom}
                        setSelectedOption={setSelectedShowroom}
                      />
                    </div>

                    <button
                      type='button'
                      onClick={handleAddMovieTiming}
                      className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700'
                    >
                      Add Timing
                    </button>
                  </div>

                  <div className='divide-y divide-gray-200'>
                    {groupTimingsByDate(movieTimings).map(group => (
                      <div
                        key={group.date}
                        className='flex items-start py-4 px-6'
                      >
                        <div className='w-1/3 text-left'>
                          <h5 className='font-bold text-md text-gray-700'>
                            {formatDate(group.date)}
                          </h5>
                        </div>

                        <div className='w-2/3 flex flex-wrap gap-3'>
                          {group.timings.map((timing, index) => {
                            const showroom = showRoomOptions.find(
                              room => room._id === timing.showroom
                            )
                            return (
                              <div
                                key={`${timing.date}-${timing.time}-${index}`}
                                className='flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow-sm border'
                              >
                                <span className='text-sm text-gray-700'>
                                  {timing.time} ({showroom?.name || 'Unknown'})
                                </span>
                                <button
                                  type='button'
                                  onClick={() =>
                                    handleRemoveTiming(
                                      movieTimings.findIndex(
                                        t =>
                                          t.date === timing.date &&
                                          t.time === timing.time &&
                                          t.showroom === timing.showroom
                                      )
                                    )
                                  }
                                  className='text-red-500 hover:text-red-700 text-xs'
                                >
                                  ✕
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              <div className='flex justify-end mt-6'>
                <Link href={`/dashboard/admin/movies`}>
                  <button
                    type='button'
                    className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50'
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

  return {
    props: {}
  }
}

export default MovieAdd
