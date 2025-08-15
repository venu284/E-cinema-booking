import React, { useState, useEffect } from 'react'
import { useMovieBookingContext } from '../../context/MovieBookingContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSingleMovieDetails } from '../../hooks/useSingleMovieDetails'
import Loader from '../Reusables/Loader'

const Summary = () => {
  const router = useRouter()
  const {
    loading: movieLoading,
    movieDetails: { ticketPrices }
  } = useSingleMovieDetails(router?.query?.id)

  const [loading, setLoading] = useState({ type: '', status: false })
  const {
    movieDetails,
    selectedDate,
    selectedTime,
    selectedSeats,
    adultTickets,
    childTickets,
    seniorTickets,
    promotionCode,
    setPromotionCode,
    discountRate,
    setDiscountRate,
    promotionName,
    setPromotionName,
    totalPrice,
    setTotalPrice
  } = useMovieBookingContext()

  const [localPromotionCode, setLocalPromotionCode] = useState(
    promotionCode || ''
  )

  const totalTickets = adultTickets + childTickets + seniorTickets

  const totalPriceBeforeDiscount =
    adultTickets * ticketPrices.adult +
    childTickets * ticketPrices.child +
    seniorTickets * ticketPrices.senior

  const discountAmount = (totalPriceBeforeDiscount * discountRate) / 100
  const calculatedTotalPrice = totalPriceBeforeDiscount - discountAmount

  useEffect(() => {
    setTotalPrice(calculatedTotalPrice)
  }, [calculatedTotalPrice, setTotalPrice])

  const handlePromotionClick = async e => {
    e.preventDefault()
    setLoading({ type: 'promotion', status: true })

    try {
      const response = await axios.post('/api/promotions/apply', {
        code: localPromotionCode,
        movieId: movieDetails?._id
      })

      const data = response.data

      if (data?.discountRate) {
        setDiscountRate(data.discountRate)
        setPromotionName(data.promotionName)
        setPromotionCode(localPromotionCode)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error applying promotion:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to apply promotion code.'
      toast.error(errorMessage)
    } finally {
      setLoading({ type: 'promotion', status: false })
    }
  }

  const renderTicketRow = (label, count, price) => {
    return count > 0 ? (
      <div className='flex items-center justify-between'>
        <span>{label}</span>
        <div>
          <span className='mr-[4px] text-gray-400 font-semibold'>{count}x</span>
          <span>{(count * price).toFixed(2)}$</span>
        </div>
      </div>
    ) : null
  }

  if (movieLoading)
    return (
      <div className='flex items-center justify-center'>
        <Loader height={10} width={10} color={'gray'} />
      </div>
    )

  return (
    <div>
      <h3 className='text-sm/4 font-semibold text-gray-400'>Your Summary</h3>

      <div className='text-white my-2'>
        <div className='flex justify-between items-center'>
          <h2 className='text-md'>{movieDetails?.title}</h2>
          <span>{movieDetails?.certificate}</span>
        </div>

        {selectedDate && selectedTime && (
          <p className='my-2 text-sm'>
            <b>On: </b> {selectedDate}, {selectedTime}
          </p>
        )}

        <div className='text-sm tracking-wide'>
          {renderTicketRow('Adult Ticket(s)', adultTickets, ticketPrices.adult)}
          {renderTicketRow('Child Ticket(s)', childTickets, ticketPrices.child)}
          {renderTicketRow(
            'Senior Ticket(s)',
            seniorTickets,
            ticketPrices.senior
          )}
        </div>

        {selectedSeats.length > 0 && (
          <div className='text-white'>
            <p className='text-sm my-3'>
              Selected {selectedSeats.length} Seats:{' '}
              <span className='font-bold'>{selectedSeats.join(', ')}</span>
            </p>
          </div>
        )}

        {totalPriceBeforeDiscount > 0 && (
          <div className='mt-4'>
            <div className='flex items-center justify-between text-md font-bold'>
              <span>Subtotal:</span>
              <span>{totalPriceBeforeDiscount.toFixed(2)}$</span>
            </div>

            {discountAmount > 0 && (
              <div className='flex items-center justify-between text-md font-bold text-green-500'>
                <span>
                  Discount ({promotionName} - {discountRate}%):
                </span>
                <span>-{discountAmount.toFixed(2)}$</span>
              </div>
            )}

            <div className='flex items-center justify-between text-md font-bold mt-2'>
              <span>Total:</span>
              <span>{calculatedTotalPrice.toFixed(2)}$</span>
            </div>
          </div>
        )}

        {promotionName && (
          <div className='mt-2 text-sm text-green-500'>
            Promotion Applied: {promotionName}
          </div>
        )}

        {router?.pathname.includes('/tickets') && (
          <>
            <div className='my-2 grid grid-cols-1 gap-x-2 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-4'>
                <input
                  id='voucher'
                  name='voucher'
                  type='text'
                  value={localPromotionCode}
                  onChange={e => setLocalPromotionCode(e.target.value)}
                  placeholder='Promotion Code'
                  className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6'
                />
              </div>
              <div className='sm:col-span-2'>
                <button
                  disabled={
                    (loading?.type === 'promotion' && loading.status) ||
                    localPromotionCode.trim() === ''
                  }
                  onClick={handlePromotionClick}
                  type='button'
                  className={`w-full rounded-md bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 shadow-sm cursor-pointer ${
                    loading?.type === 'promotion' && loading.status
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-orange-100'
                  }`}
                >
                  {loading?.type === 'promotion' && loading.status
                    ? 'Applying...'
                    : 'Apply'}
                </button>
              </div>
            </div>
            <Link href={`/movieoverview/${movieDetails?._id}/book/checkout`}>
              <button
                disabled={selectedSeats.length !== totalTickets}
                type='button'
                className={`w-full rounded-md bg-orange-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ${
                  selectedSeats.length !== totalTickets
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-orange-400 '
                }`}
              >
                Checkout
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Summary
