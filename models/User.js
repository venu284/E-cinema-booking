import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+?[0-9]{10,15}$/.test(v)
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    image: {
      type: String,
      default:
        'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png'
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    hash: { type: String },
    salt: { type: String },
    category: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    enabledPromotions: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    address: {
      street: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      zipCode: {
        type: Number
      }
    }
  },
  { timestamps: true }
)

userSchema.index({ email: 1 }, { unique: true })

export default mongoose.models.users || mongoose.model('users', userSchema)
