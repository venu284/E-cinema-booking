import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useSingleMovieDetails = movieid => {
  const { data, error } = useSWR(
    `/api/movies/moviedetails?id=${movieid}`,
    fetcher
  )
  return {
    movieDetails: data,
    isLoading: !error && !data,
    isError: error
  }
}
