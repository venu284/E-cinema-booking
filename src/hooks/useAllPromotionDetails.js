import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useAllPromotionDetails = () => {
  const { data, error } = useSWR(`/api/promotions/`, fetcher)
  return {
    promotions: data?.details,
    isLoading: !error && !data,
    isError: error
  }
}
