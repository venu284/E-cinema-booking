import React, { useState, useEffect } from 'react'

export const Filters = ({
  applyFilters,
  movies,
  setFilteredMovies,
  genres,
  certificates
}) => {
  const [filter, setFilter] = useState({
    keyword: '',
    allow_active: true,
    allow_inactive: true,
    allow_upcoming: true,
    selectedGenres: [],
    selectedCertificates: [],
    filterStatus: '',
    durationRange: { min: '', max: '' },
    selectedDate: ''
  })

  useEffect(() => {
    applyFilters(filter, movies, setFilteredMovies)
  }, [filter, movies, applyFilters, setFilteredMovies])

  const handleGenreChange = genre => {
    setFilter(prev => {
      const selected = prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter(g => g !== genre)
        : [...prev.selectedGenres, genre]
      return { ...prev, selectedGenres: selected }
    })
  }

  const handleCertificateChange = certificate => {
    setFilter(prev => {
      const selected = prev.selectedCertificates.includes(certificate)
        ? prev.selectedCertificates.filter(c => c !== certificate)
        : [...prev.selectedCertificates, certificate]
      return { ...prev, selectedCertificates: selected }
    })
  }

  return (
    <div className='bg-white p-4 rounded shadow w-80'>
      <h2 className='text-xl font-bold mb-4'>Filters</h2>

      {/* Search Bar */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Search by movie name...'
          value={filter.keyword}
          onChange={e => setFilter({ ...filter, keyword: e.target.value })}
          className='border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500'
        />
      </div>

      {/* Date Filter */}
      <div className='mb-4'>
        <h3 className='font-semibold mb-2'>Select Date</h3>
        <input
          type='date'
          value={filter.selectedDate}
          onChange={e =>
            setFilter(prev => ({
              ...prev,
              selectedDate: e.target.value
            }))
          }
          className='border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500'
        />
      </div>

      {/* Genre Filter */}
      <div className='mb-4'>
        <h3 className='font-semibold mb-2'>Genre</h3>
        {genres.map(genre => (
          <div key={genre} className='mb-1'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                value={genre}
                checked={filter.selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className='form-checkbox h-4 w-4 text-orange-600'
              />
              <span className='ml-2 text-gray-900'>{genre}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Certificate Filter */}
      <div className='mb-4'>
        <h3 className='font-semibold mb-2'>Certificate</h3>
        {certificates.map(certificate => (
          <div key={certificate} className='mb-1'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                value={certificate}
                checked={filter.selectedCertificates.includes(certificate)}
                onChange={() => handleCertificateChange(certificate)}
                className='form-checkbox h-4 w-4 text-orange-600'
              />
              <span className='ml-2 text-gray-900'>{certificate}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Status Dropdown */}
      <div className='mb-4'>
        <h3 className='font-semibold mb-2'>Status</h3>
        <select
          value={filter.filterStatus}
          onChange={e => setFilter({ ...filter, filterStatus: e.target.value })}
          className='border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500'
        >
          <option value=''>All</option>
          <option value='active'>Now Playing</option>
          <option value='upcoming'>Coming Soon</option>
          <option value='inactive'>Past Movies</option>
        </select>
      </div>

      {/* Duration Filter */}
      <div className='mb-4'>
        <h3 className='font-semibold mb-2'>Duration (minutes)</h3>
        <div className='flex space-x-2'>
          <input
            type='number'
            placeholder='Min'
            value={filter.durationRange.min}
            onChange={e =>
              setFilter(prev => ({
                ...prev,
                durationRange: { ...prev.durationRange, min: e.target.value }
              }))
            }
            className='border rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-500'
          />
          <input
            type='number'
            placeholder='Max'
            value={filter.durationRange.max}
            onChange={e =>
              setFilter(prev => ({
                ...prev,
                durationRange: { ...prev.durationRange, max: e.target.value }
              }))
            }
            className='border rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-500'
          />
        </div>
      </div>
    </div>
  )
}
