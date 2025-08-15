import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useAllCardDetails = () => {
  const { data, error } = useSWR(`/api/card/`, fetcher)
  return {
    cards: data?.details,
    isLoading: !error && !data,
    isError: error
  }
}
