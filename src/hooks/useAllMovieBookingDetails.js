import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useAllMovieBookingDetails = userId => {
  const { data, error } = useSWR(`/api/bookings?userId=${userId}`, fetcher)
  return {
    bookings: data?.bookings,
    isLoading: !error && !data,
    isError: error
  }
}
