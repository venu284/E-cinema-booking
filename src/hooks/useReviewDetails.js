import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useReviewDetails = movieId => {
  const { data, error } = useSWR(`/api/reviews?movieId=${movieId}`, fetcher)
  return {
    reviews: data?.reviews,
    isReviewLoading: !error && !data,
    isError: error
  }
}
