import connectDB from '../../../src/lib/connectDB.js'
import Movie from '../../../models/Movie.js'
import MovieTiming from '../../../models/MovieTiming.js'
import moment from 'moment-timezone'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchMovie(req, res)
      break
    case 'POST':
      await createMovie(req, res)
    case 'PUT':
      await updateMovie(req, res)
    case 'DELETE':
      await deleteMovie(req, res)
  }
}

const searchMovie = async (req, res) => {
  if (req.method === 'GET') {
    try {
      await connectDB()

      const { id } = req.query

      const movie = await Movie.findById(id).lean()

      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' })
      }

      const movieTimings = await MovieTiming.find({ movie: id }).lean()

      res.status(200).json({ ...movie, movieTimings })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

const createMovie = async (req, res) => {
  try {
    await connectDB()

    const { movieTimings, ...movieData } = req.body

    const session = await Movie.startSession()
    session.startTransaction()

    try {
      const movie = new Movie(movieData)
      await movie.save({ session })

      if (movieTimings && movieTimings.length > 0) {
        for (const timing of movieTimings) {
          const { date, time, showroom } = timing

          // New movie start and end times in New York timezone
          const newStartDateTime = moment.tz(
            `${date} ${time}`,
            'YYYY-MM-DD HH:mm',
            'America/New_York'
          )
          const newEndDateTime = newStartDateTime
            .clone()
            .add(movie.duration, 'minutes') // Add duration to start time

          // Fetch all existing timings in the same showroom
          const existingTimings = await MovieTiming.find({ showroom }).session(
            session
          )

          for (const existingTiming of existingTimings) {
            const existingMovie = await Movie.findById(
              existingTiming.movie
            ).session(session)

            if (!existingMovie) continue

            // Existing movie start and end times in New York timezone
            const existingStartDateTime = moment.tz(
              `${existingTiming.date.toISOString().split('T')[0]} ${
                existingTiming.time
              }`,
              'YYYY-MM-DD HH:mm',
              'America/New_York'
            )
            const existingEndDateTime = existingStartDateTime
              .clone()
              .add(existingMovie.duration, 'minutes')

            // Check for overlap
            if (
              newStartDateTime.isBetween(
                existingStartDateTime,
                existingEndDateTime,
                null,
                '[)'
              ) ||
              newEndDateTime.isBetween(
                existingStartDateTime,
                existingEndDateTime,
                null,
                '(]'
              ) ||
              existingStartDateTime.isBetween(
                newStartDateTime,
                newEndDateTime,
                null,
                '[)'
              )
            ) {
              throw new Error(
                `Showroom is already booked for another movie (${
                  existingMovie.title
                }) from ${existingStartDateTime.format(
                  'HH:mm'
                )} on ${existingStartDateTime.format('ddd MMM DD YYYY')}.`
              )
            }
          }
        }

        // If no conflicts, create timings for this movie
        const movieTimingDocs = movieTimings.map(timing => ({
          date: new Date(timing.date),
          time: timing.time,
          showroom: timing.showroom,
          movie: movie._id
        }))

        await MovieTiming.insertMany(movieTimingDocs, { session })
      }

      await session.commitTransaction()
      session.endSession()

      res.json({
        message: 'Success! Movie and Timings Created',
        movie
      })
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: error.message })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateMovie = async (req, res) => {
  try {
    await connectDB()

    const { movieTimings, _id, ...movieData } = req.body

    const session = await Movie.startSession()
    session.startTransaction()

    try {
      // Update movie details
      const movie = await Movie.findByIdAndUpdate(_id, movieData, {
        new: true,
        session
      })

      if (!movie) {
        throw new Error('Movie not found')
      }

      // Delete all existing timings for this movie
      await MovieTiming.deleteMany({ movie: movie._id }).session(session)

      if (movieTimings && movieTimings.length > 0) {
        for (const timing of movieTimings) {
          const { date, time, showroom } = timing

          // New movie start and end times in New York timezone
          const newStartDateTime = moment.tz(
            `${date} ${time}`,
            'YYYY-MM-DD HH:mm',
            'America/New_York'
          )
          const newEndDateTime = newStartDateTime
            .clone()
            .add(movie.duration, 'minutes')

          // Fetch all existing timings in the same showroom
          const existingTimings = await MovieTiming.find({ showroom }).session(
            session
          )

          for (const existingTiming of existingTimings) {
            const existingMovie = await Movie.findById(
              existingTiming.movie
            ).session(session)

            if (!existingMovie) continue

            // Existing movie start and end times in New York timezone
            const existingStartDateTime = moment.tz(
              `${existingTiming.date.toISOString().split('T')[0]} ${
                existingTiming.time
              }`,
              'YYYY-MM-DD HH:mm',
              'America/New_York'
            )
            const existingEndDateTime = existingStartDateTime
              .clone()
              .add(existingMovie.duration, 'minutes')

            // Check for overlap
            if (
              newStartDateTime.isBetween(
                existingStartDateTime,
                existingEndDateTime,
                null,
                '[)'
              ) ||
              newEndDateTime.isBetween(
                existingStartDateTime,
                existingEndDateTime,
                null,
                '(]'
              ) ||
              existingStartDateTime.isBetween(
                newStartDateTime,
                newEndDateTime,
                null,
                '[)'
              )
            ) {
              throw new Error(
                `Showroom is already booked for another movie (${
                  existingMovie.title
                }) from ${existingStartDateTime.format(
                  'HH:mm'
                )} on ${existingStartDateTime.format('ddd MMM DD YYYY')}.`
              )
            }
          }
        }

        // If no conflicts, recreate timings for this movie
        const movieTimingDocs = movieTimings.map(timing => ({
          date: new Date(timing.date),
          time: timing.time,
          showroom: timing.showroom,
          movie: movie._id
        }))

        await MovieTiming.insertMany(movieTimingDocs, { session })
      }

      await session.commitTransaction()
      session.endSession()

      return res.status(200).json({ message: 'Movie Updated', movie })
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: error.message })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteMovie = async (req, res) => {
  try {
    await connectDB()

    const { movieId } = req.query

    const movieDetails = await Movie.findOneAndDelete({ _id: movieId })

    if (movieDetails) {
      return res.status(200).json({ message: 'Movie Deleted' })
    } else {
      return res.status(200).json({ message: 'Movie not available' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
