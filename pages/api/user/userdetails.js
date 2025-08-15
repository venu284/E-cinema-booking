import User from '../../../models/User.js'
import connectDB from '../../../src/lib/connectDB.js'
import { createTransport } from 'nodemailer'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      await searchUsers(req, res)
      break
    case 'PUT':
      await updateUserDetails(req, res)
      break
    case 'DELETE':
      await deleteUserDetails(req, res)
      break
  }
}

const searchUsers = async (req, res) => {
  try {
    await connectDB()
    const details = await User.find({}).sort({ $natural: -1 })

    if (details.length > 0) {
      return res.status(200).json({ message: 'Users Found', details })
    } else {
      return res
        .status(404)
        .json({ message: 'No Users found', details: undefined })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateUserDetails = async (req, res) => {
  try {
    await connectDB()

    const { userId } = req.query

    console.log(userId)
    if (!userId) {
      return res.status(400).json({ message: 'Invalid Credentials' })
    }

    // Validate incoming data (Optional)
    const { profile, address } = req.body

    // Update the user with the new profile and address data
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          image: profile.image,
          phone: profile.phone,
          enabledPromotions: profile.enabledPromotions,
          status: profile.status,
          category: profile.category,
          'address.street': address.street,
          'address.city': address.city,
          'address.zipCode': address.zipcode,
          'address.state': address.state
        }
      },
      { new: true } // Return the updated document
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Configure Nodemailer transporter
    const transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // Make sure this matches your SMTP settings
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD
      }
    })

    // Email options
    const mailOptions = {
      from: 'firozkhanp009@gmail.com',
      to: updatedUser.email,
      subject: 'Your Profile Has Been Updated Successfully!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Profile Update Icon" style="width: 80px; margin-bottom: 10px;" />
            <h2 style="color: #333;">Profile Updated Successfully</h2>
          </div>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Hi <strong>${updatedUser.email}</strong>,
          </p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            We just wanted to let you know that your profile information has been successfully updated.
          </p>
          <div style="margin: 20px 0; background-color: #e7f4ff; padding: 15px; border-radius: 5px;">
            <p style="font-size: 16px; color: #0073e6; text-align: center; margin: 0;">
              🎉 Your profile is now up-to-date!
            </p>
          </div>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            <strong>Updated on:</strong> ${new Date(
              updatedUser.updatedAt
            ).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })} at ${new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}
          </p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            If you didn’t update your profile, please <a href="#" style="color: #0073e6; text-decoration: none;">contact us immediately</a>.
          </p>
        </div>
      `
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    // Respond with success message
    res.status(200).json({ message: 'Details Updated', user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const deleteUserDetails = async (req, res) => {
  try {
    await connectDB()

    const { userId } = req.query

    const userdetails = await User.findOneAndDelete({
      _id: userId
    })

    if (userdetails) {
      return res.status(200).json({ message: 'User Deleted' })
    } else {
      return res.status(200).json({ message: 'User not available' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
