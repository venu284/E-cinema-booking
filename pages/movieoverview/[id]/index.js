import Image from 'next/image'
import { useSingleMovieDetails } from '../../../src/hooks/useSingleMovieDetails'
import YouTube from 'react-youtube'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ReviewForm } from '../../../src/components/Reusables/Forms/ReviewForm'
import axios from 'axios'
import { getLoginSession } from '../../../src/lib/auth'
import { findUser } from '../../../src/lib/user'
import { toast } from 'react-toastify'
import { mutate } from 'swr'
import { ReviewCard } from '../../../src/components/Reusables/ReviewCard'
import { useReviewDetails } from '../../../src/hooks/useReviewDetails'
import { useMovieBookingContext } from '../../../src/context/MovieBookingContext'
import moment from 'moment-timezone'

const onPlayerReady = event => {
  event.target.pauseVideo()
}

const opts = {
  height: '450',
  width: '800',
  playerVars: {
    autoplay: 1
  }
}

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const MovieOverviewSlug = ({ movieId, user }) => {
  const { movieDetails, loading } = useSingleMovieDetails(movieId)
  console.log(movieDetails)
  const { reviews, isReviewLoading } = useReviewDetails(movieDetails?._id)
  const { setSelectedTime, setSelectedDate, setMovieDetails } =
    useMovieBookingContext()
  const [showTimings, setShowTimings] = useState(true)
  const [groupedTimingsArray, setGroupedTimingsArray] = useState([])

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [averageRating, setAverageRating] = useState(0)

  const handleSelectShowtimeClick = (date, time) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setMovieDetails(movieDetails)
  }

  useEffect(() => {
    if (isReviewLoading || !reviews) return
    let totalRating = 0
    reviews.forEach(x => {
      totalRating += parseInt(x.rating)
    })
    if (reviews.length !== 0) setAverageRating(totalRating / reviews.length)
  }, [reviews, isReviewLoading])

  useEffect(() => {
    if (movieDetails?.movieTimings) {
      const groupByDate = movieDetails.movieTimings.reduce((acc, current) => {
        const date = new Date(current.date).toISOString().split('T')[0]
        const time = current.time

        if (!acc[date]) {
          acc[date] = []
        }

        acc[date].push(time)
        return acc
      }, {})

      const formattedTimings = Object.keys(groupByDate).map(date => ({
        date,
        times: groupByDate[date]
      }))

      setGroupedTimingsArray(formattedTimings)
    }
  }, [movieDetails])

  const handleReviewCreate = async () => {
    try {
      const { data } = await axios.post(`/api/reviews`, {
        user: user?._id,
        movie: movieDetails?._id,
        rating: rating,
        comment: review
      })

      if (data?.message == 'Success! Review Created') {
        setRating(0)
        setReview('')
        toast.success(data?.message, { toastId: data?.message })
        mutate(`/api/reviews?movieId=${movieDetails?._id}`)
      } else {
        toast.error(data?.message, { toastId: data?.message })
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (loading) return <div>Loading...</div>

  const isShowtimePassed = (date, time, timezone = 'America/New_York') => {
    const showtime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', timezone)

    const now = moment.tz(timezone)

    return showtime.isBefore(now)
  }

  return (
    <div className=''>
      <div className='border max-w-7xl mx-auto rounded-md bg-gray-50 shadow-md px-20 py-10'>
        <div className='flex justify-between items-center'>
          <div>
            <img
              src={movieDetails?.image}
              className='h-[100%] w-[38vh] rounded-md'
              alt='Movie Poster'
            />
          </div>
          <YouTube
            videoId={movieDetails?.trailer}
            opts={opts}
            onReady={onPlayerReady}
          />
        </div>
        <div className='flex justify-between my-5'>
          <div>
            <h1 className='text-lg font-bold uppercase'>
              {movieDetails?.title}
            </h1>
            <span className='text-sm text-gray-600'>
              <span>{movieDetails?.certificate}</span> |
              <span className='ml-1'>
                {Math.floor(movieDetails?.duration / 60)}hr{' '}
                {movieDetails?.duration % 60}min
              </span>{' '}
              |
              <span className='ml-1'>
                In Theaters{' '}
                {new Date(movieDetails?.movieStartDate).toLocaleDateString(
                  'en-US',
                  { month: 'long', day: 'numeric', year: 'numeric' }
                )}
              </span>
            </span>
          </div>
          <div className='flex items-center'>
            <Image
              src={'/icons/popcorn.png'}
              height='25'
              width='20'
              alt='Popcorn'
            />
            <p className='ml-1 text-md font-bold text-gray-700'>
              {averageRating != 0
                ? `${averageRating.toFixed(1)} / 5.0`
                : 'No Reviews Yet'}
            </p>
          </div>
        </div>
        <div
          className='text-md text-gray-900'
          dangerouslySetInnerHTML={{ __html: movieDetails?.description || '' }}
        ></div>
        <div className='mt-4'>
          <span className='uppercase text-sm font-bold'>GENRE: </span>
          <span className='text-sm'>{movieDetails?.genre?.join(', ')}</span>
        </div>
        <h2 className='uppercase text-sm my-1 font-bold'>Cast & Crew: </h2>
        <ul
          role='list'
          className='grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6'
        >
          {movieDetails?.cast.map(person => (
            <li className='border rounded bg-gray-100' key={person.name}>
              <h3 className='text-sm font-semibold tracking-tight text-gray-700'>
                {person?.name}
              </h3>
              <p className='text-sm leading-6 text-gray-600'>{person.value}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Show Timings and Reviews Tabs */}
      <div className='max-w-7xl mx-auto mt-6 sm:mt-2 2xl:mt-5'>
        <div className='border-b border-gray-200'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
              <button
                onClick={() => setShowTimings(true)}
                className={`px-4 py-2 rounded font-semibold ${
                  showTimings
                    ? 'bg-white text-black border border-orange-400'
                    : 'text-gray-400 hover:text-white hover:border-orange-300'
                }`}
              >
                Show Timings
              </button>

              <button
                onClick={() => setShowTimings(false)}
                className={`px-4 py-2 rounded font-semibold ${
                  !showTimings
                    ? 'bg-white text-black border border-orange-400'
                    : 'text-gray-400 hover:text-white hover:border-orange-300'
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Show Timings Section */}
      {showTimings ? (
        <div className='max-w-7xl mx-auto'>
          <div className='divide-y divide-gray-200'>
            {groupedTimingsArray.map(movie => (
              <div key={movie.date} className='flex items-center py-4 px-6'>
                {/* Date Header */}
                <div className='w-1/3 text-left'>
                  <h3 className='font-bold text-md text-gray-200'>
                    {new Date(movie.date).toLocaleDateString('en-US', {
                      timeZone: 'UTC',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                </div>

                {/* Showtimes */}
                <div className='w-2/3 flex flex-wrap gap-3 justify-start'>
                  {movie?.times.map(time => {
                    const passed = isShowtimePassed(movie.date, time)
                    return (
                      <Link
                        key={`${movie.date}-${time}`}
                        href={
                          passed
                            ? '#'
                            : `/movieoverview/${movieDetails?._id}/book/seats`
                        }
                        onClick={e => {
                          if (passed) {
                            e.preventDefault()
                          } else {
                            handleSelectShowtimeClick(movie.date, time)
                          }
                        }}
                      >
                        <button
                          className={`px-4 py-2 border rounded ${
                            passed
                              ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                              : 'border-orange-400 text-orange-700 hover:bg-orange-50'
                          }`}
                          disabled={passed}
                        >
                          {time}
                        </button>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto'>
          {user && (
            <ReviewForm
              rating={rating}
              review={review}
              setRating={setRating}
              setReview={setReview}
              handleCreate={handleReviewCreate}
            />
          )}
          <div>
            {reviews?.map(review => (
              <ReviewCard key={review?._id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({ req, res, query }) => {
  const session = await getLoginSession(req)
  const user = (session?._doc && (await findUser(session._doc))) ?? null

  return {
    props: {
      movieId: query.id,
      user: JSON.parse(JSON.stringify(user))
    }
  }
}

export default MovieOverviewSlug
