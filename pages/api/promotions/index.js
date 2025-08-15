import connectDB from '../../../src/lib/connectDB.js'
import Promotion from '../../../models/Promotion.js'
import User from '../../../models/User.js'
import { createTransport } from 'nodemailer'

export const sendPromotionEmails = async (users, promotion) => {
  const transporter = createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASSWORD
    }
  })

  const movieTitles = promotion.selectedMovies
    .map(movie => movie.title)
    .join(', ')

  const mailOptions = user => ({
    from: 'firozkhanp009@gmail.com',
    to: user.email,
    subject: `New Promotion: ${promotion.name}`,
    html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #333;">Exciting New Promotion!</h2>
        </div>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Hello <strong>${user.firstName}</strong>,
        </p>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          We are excited to announce a new promotion: <strong>${
            promotion.name
          }</strong>!
        </p>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          ${promotion.description}
        </p>

        <div style="background-color: #fff3cd; padding: 15px; border-left: 6px solid #ffeeba; margin: 20px 0;">
          <p style="color: #856404; font-size: 16px; line-height: 1.6; margin: 0;">
            Use the code <strong>"${
              promotion.code
            }"</strong> to get a <strong>${
      promotion.discountRate
    }% discount</strong> on the following movies:
          </p>
          <p style="color: #856404; font-size: 16px; line-height: 1.6; margin: 10px 0 0;">
            <strong>${movieTitles}</strong>
          </p>
        </div>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Promotion valid from <strong>${new Date(
            promotion.promotionStartDate
          ).toLocaleDateString()}</strong> to <strong>${new Date(
      promotion.promotionEndDate
    ).toLocaleDateString()}</strong>.
        </p>

        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Don't miss out on this limited-time offer. Enjoy!
        </p>

        <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 20px;">
          Best regards,<br />
          <strong>Your Company Team</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

        <p style="color: #999; font-size: 12px; text-align: center;">
          If you have any questions, feel free to <a href="mailto:support@yourcompany.com" style="color: #0073e6; text-decoration: none;">contact our support team</a>.
        </p>
      </div>`
  })

  for (const user of users) {
    try {
      await transporter.sendMail(mailOptions(user))
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error)
    }
  }
}

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchAllPromotions(req, res)
      break
    case 'POST':
      await sendPromotion(req, res)
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}

const searchAllPromotions = async (req, res) => {
  try {
    await connectDB()
    const details = await Promotion.find({}).sort({ $natural: -1 })

    if (details.length > 0) {
      return res.status(200).json({ message: 'Promotions Found', details })
    } else {
      return res
        .status(404)
        .json({ message: 'Promotions not found', details: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const sendPromotion = async (req, res) => {
  try {
    await connectDB()
    const { promotionId } = req.body

    if (!promotionId) {
      return res
        .status(400)
        .json({ success: false, message: 'Promotion ID is required' })
    }

    const promotion = await Promotion.findById(promotionId).populate(
      'selectedMovies',
      'title'
    )
    if (!promotion) {
      return res
        .status(404)
        .json({ success: false, message: 'Promotion not found' })
    }

    if (promotion.isSent) {
      return res
        .status(400)
        .json({ success: false, message: 'Promotion has already been sent' })
    }

    const users = await User.find({ enabledPromotions: true })

    await sendPromotionEmails(users, promotion)

    promotion.isSent = true
    await promotion.save()

    return res
      .status(200)
      .json({ success: true, message: 'Promotion sent successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
