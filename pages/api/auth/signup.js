import { createUser } from '../../../src/lib/user'
import { createTransport } from 'nodemailer'

export default async function signup (req, res) {
  try {
    await createUser(req.body)
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
      to: req.body.username,
      subject: 'Welcome to Our Platform! – Account Created Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding-bottom: 20px;">
            <h2 style="color: #333;">Welcome to Our Community!</h2>
          </div>
    
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Hi <strong>${req.body.username}</strong>,
          </p>
    
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            We are thrilled to have you on board! Your new account has been created successfully. You can now explore all the features we offer and get the most out of our platform.
          </p>
    
    
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            If you didn’t create this account, please ignore this email or contact our support team immediately to secure your information.
          </p>
    
          <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            Thank you for joining us! We're excited to have you as part of our community.<br />
            <strong>Your Support Team</strong>
          </p>
    
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            Need help? Visit our <span style="color: #0073e6; text-decoration: none;">Support Center</span>.
          </p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
