# E-Cinema Booking System

E-Cinema Booking is a comprehensive online platform that allows users to browse movies, view showtimes, select seats, and book tickets for cinema experiences. The system provides an intuitive interface for users and an efficient management system for cinema administrators.

## ✨ Features

### For Customers
- Browse current and upcoming movie listings
- View detailed movie information (synopsis, cast, ratings, trailers)
- Check theater locations and available showtimes
- Interactive seat selection
- Secure payment processing
- Booking confirmation and e-tickets
- User account management
- Booking history and favorite theaters

### For Administrators
- Movie management (add, edit, remove)
- Showtime scheduling
- Theater and screen configuration
- Seat map management
- Pricing and promotion management
- User management

## 🛠️ Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- React.js
- Redux for state management
- Material-UI/Bootstrap for responsive design
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB/PostgreSQL for database
- JWT for authentication
- Stripe/PayPal for payment processing

### DevOps
- Git for version control
- Docker for containerization
- CI/CD pipeline with GitHub Actions
- Deployed on AWS/Heroku/Vercel

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- MongoDB/PostgreSQL
- API keys for payment processors

## 🚀 Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/venu284/e-cinema-booking.git
cd e-cinema-booking
```

2. Install dependencies
```bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Create .env files in both frontend and backend directories
# Backend .env example
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecinema
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key

# Frontend .env example
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development servers
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm start
```

5. Navigate to `http://localhost:3000` to access the application

## 💻 Usage

### Customer Flow
1. Register/Login to your account
2. Browse movies and select one of interest
3. Choose a theater and showtime
4. Select available seats
5. Proceed to payment
6. Receive booking confirmation and e-ticket

### Admin Flow
1. Login to admin dashboard
2. Manage movies, showtimes, and theaters
3. View booking statistics and generate reports
4. Handle customer support requests

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Add new movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Showtimes
- `GET /api/showtimes` - Get all showtimes
- `GET /api/showtimes/:id` - Get showtime details
- `POST /api/showtimes` - Add new showtime (Admin only)
- `PUT /api/showtimes/:id` - Update showtime (Admin only)
- `DELETE /api/showtimes/:id` - Delete showtime (Admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details


## 🤝 Contributing

We welcome contributions to enhance the E-Cinema Booking System! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the code style guidelines.


---

⭐️ If you found this project helpful, please give it a star on GitHub! ⭐️
