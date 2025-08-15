import otpGenerator from 'otp-generator'
import crypto from 'crypto'
import connectDB from '../../../src/lib/connectDB'
import Otp from '../../../models/Otp'
import User from '../../../models/User'
import { createTransport } from 'nodemailer'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await getUserDetails(req, res)
      break
    case 'POST':
      await verifyUser(req, res)
      break
    case 'PUT':
      await updatePassword(req, res)
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

var hashPwd = function hashPwd (pwd) {
  var hmac = crypto.createHmac('sha256', process.env.SALT)
  return hmac.update(pwd).digest('hex')
}

const updatePassword = async (req, res) => {
  try {
    await connectDB()
    const { email, password } = req.query
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex')

    const details = await User.findOneAndUpdate(
      { email },
      {
        salt,
        hash
      },
      { new: true }
    )
    if (details) {
      return res.status(200).json({ message: 'Password Updated', details })
    } else {
      return res.status(400).json({ message: 'Something went wrong' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const verifyUser = async (req, res) => {
  try {
    await connectDB()
    const { otp, email } = req.query

    const details = await Otp.findOne({ email }).sort({ _id: -1 }).limit(1)

    if (details) {
      if (details.otp == hashPwd(otp)) {
        return res.status(200).json({ message: 'You have entered correct OTP' })
      } else {
        return res.status(400).json({ message: 'Please enter correct OTP' })
      }
    } else {
      return res.status(404).json({ message: 'OTP not found' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const getUserDetails = async (req, res) => {
  try {
    await connectDB()
    const { email } = req.query

    const details = await User.find({ email })

    if (details.length > 0) {
      const generatedOTP = otpGenerator.generate(8, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: true,
        specialChars: false
      })

      let hashedOTP = hashPwd(generatedOTP)
      const otp = new Otp({ email, otp: hashedOTP })
      await otp.save()

      console.log(generatedOTP)

      // Configure API key authorization: api-key
      const transporter = createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASSWORD
        }
      })

      console.log(transporter)

      const mailOptions = {
        from: 'firozkhanp009@gmail.com',
        to: email,
        subject: 'Reset Your Password - OTP Inside',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #333;">Password Reset Request</h2>
              </div>

              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Hi <strong>${email}</strong>,
              </p>

              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                We received a request to reset your account password. Use the OTP code below to proceed with resetting your password:
              </p>

              <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #FF6F61; background-color: #ffe6e1; border-radius: 5px;">
                  ${generatedOTP}
                </span>
              </div>

              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                This OTP is valid for 10 minutes. If you didn’t request a password reset, please ignore this email or contact our support team immediately to secure your account.
              </p>

              <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 20px;">
                Thank you for using our service!<br />
                <strong>Your Support Team</strong>
              </p>

              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">
        If you need further assistance, visit our <span style="color: #0073e6; text-decoration: none">Support Center</a>.
      </p>
            </div>
          `
      }

      await transporter.sendMail(mailOptions)

      return res.status(200).json({ message: 'OTP has sent to your email' })
    } else {
      return res
        .status(404)
        .json({ message: 'Details not found', details: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
