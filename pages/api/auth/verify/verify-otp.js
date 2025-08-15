import Otp from '../../../../models/Otp'
import User from '../../../../models/User'
import connectDB from '../../../../src/lib/connectDB'
import crypto from 'crypto'

var hashPwd = function hashPwd (pwd) {
  var hmac = crypto.createHmac('sha256', process.env.SALT)
  return hmac.update(pwd).digest('hex')
}

export default async function handler (req, res) {
  await connectDB()

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' })
  }

  const { email, otp } = req.body

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and OTP are required' })
  }

  try {
    const otpRecord = await Otp.findOne({ email }).sort({ _id: -1 }).limit(1)

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired OTP' })
    }

    if (otpRecord.otp == hashPwd(otp)) {
      console.log('inside')
      await User.updateOne({ email }, { isVerified: true })
      await Otp.deleteOne({ _id: otpRecord._id })

      return res
        .status(200)
        .json({ success: true, message: 'Account verified successfully' })
    } else {
      return res.status(400).json({ message: 'Please enter correct OTP' })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
