import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useAllMovieDetails = () => {
  const { data, error } = useSWR(`/api/movies/`, fetcher)
  return {
    movies: data?.details,
    isLoading: !error && !data,
    isError: error
  }
}
