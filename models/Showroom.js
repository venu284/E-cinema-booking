import mongoose from 'mongoose'

const showroomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    name: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

const Showroom =
  mongoose.models.showrooms || mongoose.model('showrooms', showroomSchema)

export default Showroom
