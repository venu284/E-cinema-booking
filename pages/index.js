import React, { useState, useEffect } from 'react'
import { Filters } from '../src/components/HomePage/Filters'
import { MovieList } from '../src/components/HomePage/MovieList'
import { useAllMovieDetails } from '../src/hooks/useAllMovieDetails'
import { applyFilters } from '../src/lib/helper'

const Home = () => {
  const { isLoading, movies } = useAllMovieDetails()
  const [filteredMovies, setFilteredMovies] = useState([])

  const [genres, setGenres] = useState([])
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    if (!movies) return
    setFilteredMovies(movies)

    const uniqueGenres = Array.from(
      new Set(movies.flatMap(movie => movie.genre))
    )
    setGenres(uniqueGenres)

    const uniqueCertificates = Array.from(
      new Set(movies.map(movie => movie.certificate))
    )
    setCertificates(uniqueCertificates)
  }, [movies])

  if (isLoading) return <div className='p-4'>Loading...</div>

  return (
    <main className='flex flex-col lg:flex-row mt-[10vh]'>
      <aside className='w-full lg:w-1/4 p-4'>
        <Filters
          applyFilters={applyFilters}
          movies={movies}
          setFilteredMovies={setFilteredMovies}
          genres={genres}
          certificates={certificates}
        />
      </aside>

      <section className='w-full lg:w-3/4 p-4'>
        <MovieList title='Movies' movielist={filteredMovies} />
      </section>
    </main>
  )
}

export default Home
