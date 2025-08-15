import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useSingleCardDetail = cardId => {
  const { data, error } = useSWR(
    `/api/card/carddetails?cardId=${cardId}`,
    fetcher
  )
  return {
    cardDetail: data?.cardDetails,
    isLoading: !error && !data,
    isError: error
  }
}
