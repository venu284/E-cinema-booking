import moment from 'moment-timezone'

export const getSelected = (options, value) => {
  if (!value) return options[0]
  return options.filter(x => x.name === value).length > 0
    ? options.filter(x => x.name === value)[0]
    : options[0]
}

export const getBookingDatePassed = bookingDateString => {
  const timeZone = 'America/New_York'

  const bookingDate = moment.tz(bookingDateString, timeZone)
  const now = moment.tz(timeZone)

  const diffHours = now.diff(bookingDate, 'hours', true)

  console.log(`Current Time: ${now.format()}`)
  console.log(`Booking Time: ${bookingDate.format()}`)
  console.log(`Difference in hours: ${diffHours.toFixed(2)} hours`)

  return diffHours <= 3
}

export const maskCardNumber = cardNumber => {
  const cardStr = cardNumber.toString()
  const lastFour = cardStr.slice(-4)
  const masked = lastFour.padStart(cardStr.length, 'X')
  return masked
}

export const certificateOptions = [
  { id: 1, name: 'G' },
  { id: 2, name: 'PG' },
  { id: 3, name: 'PG-13' },
  { id: 4, name: 'R' },
  { id: 5, name: 'NC-17' },
  { id: 6, name: 'NR' }
]

export const stateOptions = [
  { id: 1, name: 'Alabama' },
  { id: 2, name: 'Alaska' },
  { id: 3, name: 'Arizona' },
  { id: 4, name: 'Arkansas' },
  { id: 5, name: 'California' },
  { id: 6, name: 'Colorado' },
  { id: 7, name: 'Connecticut' },
  { id: 8, name: 'Delaware' },
  { id: 9, name: 'Florida' },
  { id: 10, name: 'Georgia' },
  { id: 11, name: 'Hawaii' },
  { id: 12, name: 'Idaho' },
  { id: 13, name: 'Illinois' },
  { id: 14, name: 'Indiana' },
  { id: 15, name: 'Iowa' },
  { id: 16, name: 'Kansas' },
  { id: 17, name: 'Kentucky' },
  { id: 18, name: 'Louisiana' },
  { id: 19, name: 'Maine' },
  { id: 20, name: 'Maryland' },
  { id: 21, name: 'Massachusetts' },
  { id: 22, name: 'Michigan' },
  { id: 23, name: 'Minnesota' },
  { id: 24, name: 'Mississippi' },
  { id: 25, name: 'Missouri' },
  { id: 26, name: 'Montana' },
  { id: 27, name: 'Nebraska' },
  { id: 28, name: 'Nevada' },
  { id: 29, name: 'New Hampshire' },
  { id: 30, name: 'New Jersey' },
  { id: 31, name: 'New Mexico' },
  { id: 32, name: 'New York' },
  { id: 33, name: 'North Carolina' },
  { id: 34, name: 'North Dakota' },
  { id: 35, name: 'Ohio' },
  { id: 36, name: 'Oklahoma' },
  { id: 37, name: 'Oregon' },
  { id: 38, name: 'Pennsylvania' },
  { id: 39, name: 'Rhode Island' },
  { id: 40, name: 'South Carolina' },
  { id: 41, name: 'South Dakota' },
  { id: 42, name: 'Tennessee' },
  { id: 43, name: 'Texas' },
  { id: 44, name: 'Utah' },
  { id: 45, name: 'Vermont' },
  { id: 46, name: 'Virginia' },
  { id: 47, name: 'Washington' },
  { id: 48, name: 'West Virginia' },
  { id: 49, name: 'Wisconsin' },
  { id: 50, name: 'Wyoming' }
]

export const cardOptions = [
  { id: 1, name: 'Visa' },
  { id: 2, name: 'Mastercard' },
  { id: 3, name: 'Discover' }
]

export const statusOptions = [
  { id: 1, name: 'Draft' },
  { id: 2, name: 'Public' }
]

export const genreOptions = [
  { id: 1, title: 'Action', _id: 'Action' },
  { id: 2, title: 'Comedy', _id: 'Comedy' },
  { id: 3, title: 'Drama', _id: 'Drama' },
  { id: 4, title: 'Fantasy', _id: 'Fantasy' },
  { id: 5, title: 'Horror', _id: 'Horror' },
  { id: 6, title: 'Mystery', _id: 'Mystery' },
  { id: 7, title: 'Romance', _id: 'Romance' },
  { id: 8, title: 'Thriller', _id: 'Thriller' },
  { id: 9, title: 'Sci-Fi', _id: 'Sci-Fi' },
  { id: 10, title: 'Documentary', _id: 'Documentary' },
  { id: 11, title: 'Animation', _id: 'Animation' },
  { id: 12, title: 'Adventure', _id: 'Adventure' }
]

export const applyFilters = (filter, movies, setFilteredMovies) => {
  if (!movies) return

  const currDate = new Date().toISOString()

  const updatedMovies = movies.filter(movie => {
    const {
      movieStartDate,
      movieEndDate,
      title,
      genre,
      certificate,
      duration,
      status
    } = movie

    let movieStatus = 'inactive'

    if (movieStartDate && movieEndDate) {
      if (new Date(movieStartDate) > new Date()) {
        movieStatus = 'upcoming'
      } else if (new Date(movieEndDate) < new Date()) {
        movieStatus = 'inactive'
      } else {
        movieStatus = 'active'
      }
    } else {
      movieStatus = 'inactive'
    }

    if (movieStatus === 'active' && !filter.allow_active) return false
    if (movieStatus === 'inactive' && !filter.allow_inactive) return false
    if (movieStatus === 'upcoming' && !filter.allow_upcoming) return false

    if (filter.keyword) {
      const keywordMatch = title
        .toLowerCase()
        .includes(filter.keyword.toLowerCase())
      if (!keywordMatch) return false
    }

    if (filter.selectedGenres.length > 0) {
      const genreMatch = genre.some(g => filter.selectedGenres.includes(g))
      if (!genreMatch) return false
    }

    if (filter.selectedCertificates.length > 0) {
      const certificateMatch = filter.selectedCertificates.includes(certificate)
      if (!certificateMatch) return false
    }

    if (
      filter.durationRange.min !== '' &&
      duration < Number(filter.durationRange.min)
    )
      return false
    if (
      filter.durationRange.max !== '' &&
      duration > Number(filter.durationRange.max)
    )
      return false

    if (filter.filterStatus) {
      if (filter.filterStatus.toLowerCase() !== movieStatus) return false
    }

    if (filter.selectedDate) {
      const selectedDate = new Date(filter.selectedDate)
      const startDate = new Date(movieStartDate)
      const endDate = new Date(movieEndDate)

      if (selectedDate < startDate || selectedDate > endDate) {
        return false
      }
    }

    return true
  })

  setFilteredMovies([...updatedMovies])
}
