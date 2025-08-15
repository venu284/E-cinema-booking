import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '../lib/hooks'

const MovieBookingContext = createContext()

export function MovieBookingContextProvider ({ children }) {
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [adultTickets, setAdultTickets] = useState(0)
  const [childTickets, setChildTickets] = useState(0)
  const [seniorTickets, setSeniorTickets] = useState(0)

  const [promotionCode, setPromotionCode] = useState('')
  const [discountRate, setDiscountRate] = useState(0)
  const [promotionName, setPromotionName] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)

  const user = useUser()

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const savedState = localStorage.getItem('movieBookingState')
      if (savedState) {
        const parsedState = JSON.parse(savedState)

        setSelectedSeats(parsedState.selectedSeats || [])
        setSelectedTime(parsedState.selectedTime || null)
        setSelectedDate(parsedState.selectedDate || null)
        setMovieDetails(parsedState.movieDetails || null)
        setAdultTickets(parsedState.adultTickets || 0)
        setChildTickets(parsedState.childTickets || 0)
        setSeniorTickets(parsedState.seniorTickets || 0)
        setPromotionCode(parsedState.promotionCode || '')
        setDiscountRate(parsedState.discountRate || 0)
        setPromotionName(parsedState.promotionName || '')
        setTotalPrice(parsedState.totalPrice || 0)
      }
    }
  }, [user])

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const stateToSave = {
        selectedSeats,
        selectedTime,
        selectedDate,
        movieDetails,
        adultTickets,
        childTickets,
        seniorTickets,
        promotionCode,
        discountRate,
        promotionName,
        totalPrice
      }
      localStorage.setItem('movieBookingState', JSON.stringify(stateToSave))
    }
  }, [
    selectedSeats,
    selectedTime,
    selectedDate,
    movieDetails,
    adultTickets,
    childTickets,
    seniorTickets,
    promotionCode,
    discountRate,
    promotionName,
    totalPrice,
    user
  ])

  const state = {
    selectedSeats,
    setSelectedSeats,
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate,
    movieDetails,
    setMovieDetails,
    adultTickets,
    setAdultTickets,
    childTickets,
    setChildTickets,
    seniorTickets,
    setSeniorTickets,
    promotionCode,
    setPromotionCode,
    discountRate,
    setDiscountRate,
    promotionName,
    setPromotionName,
    totalPrice,
    setTotalPrice
  }

  return (
    <MovieBookingContext.Provider value={state}>
      {children}
    </MovieBookingContext.Provider>
  )
}

export function useMovieBookingContext () {
  return useContext(MovieBookingContext)
}
