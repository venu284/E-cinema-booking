import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useAllUserCardDetails = userId => {
  const { data, error } = useSWR(`/api/payment-cards?userId=${userId}`, fetcher)
  return {
    cards: data?.paymentCards,
    isLoading: !error && !data,
    isError: error
  }
}
