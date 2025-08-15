import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(res => res.data)

export const useAllUserDetails = () => {
  const { data, error } = useSWR(`/api/user/userdetails`, fetcher)
  return {
    users: data?.details,
    isLoading: !error && !data,
    isError: error
  }
}
