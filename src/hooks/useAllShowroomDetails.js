import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useAllShowroomDetails = () => {
  const { data, error } = useSWR(`/api/showrooms/`, fetcher)
  return {
    showrooms: data?.details,
    isLoading: !error && !data,
    isError: error
  }
}
