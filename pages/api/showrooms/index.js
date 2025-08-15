import Showroom from '../../../models/Showroom.js'
import connectDB from '../../../src/lib/connectDB.js'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchAllShowrooms(req, res)
      break
    case 'POST':
      await createShowroom(req, res)
      break
    case 'PUT':
      await editShowroom(req, res)
      break
    case 'DELETE':
      await deleteShowroom(req, res)
      break
  }
}

const searchAllShowrooms = async (req, res) => {
  try {
    await connectDB()
    const details = await Showroom.find({}).sort({ $natural: -1 })

    if (details.length > 0) {
      return res.status(200).json({ message: 'Showrooms Found', details })
    } else {
      return res
        .status(404)
        .json({ message: 'Showrooms not found', details: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const createShowroom = async (req, res) => {
  try {
    await connectDB()

    const createShowroom = new Showroom(req.body)
    await createShowroom.save()
    res.json({
      message: 'Success! Showroom Created',
      showroom: createShowroom
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const editShowroom = async (req, res) => {
  try {
    await connectDB()

    const showroom = await Showroom.findByIdAndUpdate(req.body._id, req.body, {
      new: true
    })
    if (showroom) {
      return res.status(200).json({ message: 'Showroom Updated', showroom })
    } else {
      return res.status(200).json({ message: 'Please try again!' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteShowroom = async (req, res) => {
  try {
    await connectDB()

    const { showroomId } = req.query

    const showroomDetails = await Showroom.findOneAndDelete({ _id: showroomId })

    if (showroomDetails) {
      return res.status(200).json({ message: 'Showroom Deleted' })
    } else {
      return res.status(200).json({ message: 'Showroom not available' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
