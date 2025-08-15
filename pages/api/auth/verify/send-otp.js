import Otp from '../../../../models/Otp'
import User from '../../../../models/User'
import connectDB from '../../../../src/lib/connectDB'
import { createTransport } from 'nodemailer'
import otpGenerator from 'otp-generator'
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

  const { email } = req.body

  console.log(email)

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: 'Email is required' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

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

    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD
      }
    })

    const mailOptions = {
      from: 'firozkhanp009@gmail.com',
      to: email,
      subject: 'Verify your account - OTP Inside',
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #333;">Account Verification</h2>
        </div>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Hi <strong>${email}</strong>,
        </p>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Thank you for registering with us. Use the OTP code below to verify your account:
        </p>

        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #FF6F61; background-color: #ffe6e1; border-radius: 5px;">
            ${generatedOTP}
          </span>
        </div>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          This OTP is valid for 5 minutes. If you didn’t request this, please ignore this email or contact our support team immediately.
        </p>

        <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 20px;">
          Thank you for using our service!<br />
          <strong>Your Support Team</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">
          If you need further assistance, visit our <p style="color: #0073e6; text-decoration: none">Support Center</p>.
        </p>
      </div>
          `
    }

    await transporter.sendMail(mailOptions)

    return res.status(200).json({ message: 'OTP sent to your email' })
  } catch (error) {
    console.error('Error in send-otp:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
