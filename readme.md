# Natours

A full-stack tour booking application built with Node.js, Express, MongoDB, and modern JavaScript.

## Overview

Natours is a tour booking platform that allows users to browse adventure tours, view detailed information, and book their next adventure. Built with the MEN (MongoDB, Express, Node.js) stack and server-side rendering with Pug templates, it features a RESTful API, secure authentication, payment processing, and email notifications.

## Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Tour Management** - CRUD operations for tours with advanced filtering, sorting, and pagination
- **Booking System** - Stripe integration for secure payment processing
- **Interactive Maps** - Mapbox integration to display tour locations
- **User Profiles** - Account management with photo upload and data updates
- **Email System** - Automated emails for welcome, password reset, and booking confirmations
- **Security Features** - Rate limiting, data sanitization, XSS protection, and parameter pollution prevention
- **Performance Optimization** - Database indexing, query optimization, and compression
- **Error Handling** - Centralized error handling with development and production modes

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn package manager
- Stripe account for payment processing
- Mapbox account for map functionality
- SendGrid or Mailtrap for email services

### Installation

```bash
# Clone the repository
git clone https://github.com/N73311/natours.git
cd natours

# Install dependencies
npm install

# Set up environment variables
cp config.env.example config.env
# Edit config.env with your credentials
```

### Environment Variables

Create a `config.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/natours
DATABASE_PASSWORD=your_password

JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_FROM=your-email@example.com
EMAIL_USERNAME=your-email-username
EMAIL_PASSWORD=your-email-password
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Development

```bash
# Start development server with nodemon
npm run start:dev

# Watch JavaScript files with Parcel
npm run watch:js

# Debug with Node debugger
npm run debug
```

### Production

```bash
# Build JavaScript for production
npm run build:js

# Start production server
npm start

# Start with production environment
npm run start:prod
```

## Project Structure

```
natours/
├── controllers/            # Route controllers (business logic)
│   ├── authController.js   # Authentication and authorization
│   ├── tourController.js   # Tour CRUD operations
│   ├── userController.js   # User management
│   ├── reviewController.js # Review management
│   ├── bookingController.js # Booking and payments
│   ├── viewsController.js  # Server-side rendering
│   └── errorController.js  # Global error handling
├── models/                 # Mongoose models
│   ├── tourModel.js        # Tour schema and methods
│   ├── userModel.js        # User schema with authentication
│   ├── reviewModel.js      # Review schema
│   └── bookingModel.js     # Booking schema
├── routes/                 # Express route definitions
│   ├── tourRoutes.js       # Tour endpoints
│   ├── userRoutes.js       # User endpoints
│   ├── reviewRoutes.js     # Review endpoints
│   ├── bookingRoutes.js    # Booking endpoints
│   └── viewRoutes.js       # View (SSR) routes
├── utils/                  # Utility functions
│   ├── apiFeatures.js      # API filtering, sorting, pagination
│   ├── appError.js         # Custom error class
│   ├── catchAsync.js       # Async error wrapper
│   └── email.js            # Email sending functionality
├── views/                  # Pug templates
│   ├── base.pug            # Base template
│   ├── overview.pug        # Tours listing
│   ├── tour.pug            # Tour details
│   └── ...                 # Other views
├── public/                 # Static files
│   ├── js/                 # Client-side JavaScript
│   ├── css/                # Stylesheets
│   └── img/                # Images
├── dev-data/               # Development data
├── app.js                  # Express app configuration
├── server.js               # Server startup
└── package.json            # Dependencies and scripts
```

## API Documentation

### Tours
- `GET /api/v1/tours` - Get all tours
- `GET /api/v1/tours/:id` - Get tour by ID
- `POST /api/v1/tours` - Create new tour (admin/lead-guide)
- `PATCH /api/v1/tours/:id` - Update tour (admin/lead-guide)
- `DELETE /api/v1/tours/:id` - Delete tour (admin/lead-guide)
- `GET /api/v1/tours/top-5-cheap` - Get top 5 cheapest tours
- `GET /api/v1/tours/tour-stats` - Get tour statistics
- `GET /api/v1/tours/monthly-plan/:year` - Get monthly tour plan

### Users
- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/logout` - User logout
- `POST /api/v1/users/forgotPassword` - Password reset request
- `PATCH /api/v1/users/resetPassword/:token` - Reset password
- `PATCH /api/v1/users/updateMyPassword` - Update password
- `PATCH /api/v1/users/updateMe` - Update user data
- `DELETE /api/v1/users/deleteMe` - Deactivate user account

### Bookings
- `GET /api/v1/bookings/checkout-session/:tourId` - Create Stripe checkout session
- `POST /api/v1/bookings` - Create booking (admin)
- `GET /api/v1/bookings` - Get all bookings (admin)
- `GET /api/v1/bookings/:id` - Get booking by ID
- `PATCH /api/v1/bookings/:id` - Update booking (admin)
- `DELETE /api/v1/bookings/:id` - Delete booking (admin)

## Technologies Used

- **Backend Framework** - Express.js
- **Database** - MongoDB with Mongoose ODM
- **Authentication** - JWT (JSON Web Tokens)
- **Payment Processing** - Stripe API
- **Email Service** - Nodemailer with SendGrid/Mailtrap
- **Security** - Helmet, bcrypt, express-rate-limit, express-mongo-sanitize
- **File Upload** - Multer with Sharp for image processing
- **Maps** - Mapbox GL JS
- **Template Engine** - Pug
- **Client-side JS** - Vanilla JavaScript with Parcel bundler
- **Development** - Nodemon, ESLint, Prettier

## Security Features

- Password encryption using bcrypt
- JWT token-based authentication
- Protection against NoSQL injection attacks
- XSS protection with data sanitization
- HTTP parameter pollution prevention
- Rate limiting on API endpoints
- Secure HTTP headers with Helmet
- CORS configuration
- Cookie security with httpOnly flag

## Testing

```bash
# Run linting
npm run lint

# Manual API testing
# Use Postman collection (included in dev-data folder)
```

## Deployment

The application is designed to be deployed on platforms like Heroku, AWS, or DigitalOcean:

1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Build JavaScript files: `npm run build:js`
4. Deploy using your preferred platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Acknowledgments

- Built as part of Node.js, Express, MongoDB & More course
- Tour data and images from various sources
- Icons from Font Awesome
- Maps powered by Mapbox
