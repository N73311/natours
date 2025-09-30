# Natours

A full-stack tour booking application built with Node.js, Express, MongoDB, and server-side rendering.

[View Portfolio](https://zachayers.io) | [Live Demo](https://www.natours.zachayers.io)

## About

Natours is a tour booking platform featuring user authentication, tour management, payment processing with Stripe, interactive Mapbox maps, and automated email notifications. Built with the MEN stack (MongoDB, Express, Node.js) and Pug templating.

## Built With

- Node.js
- Express.js
- MongoDB (Mongoose)
- Pug (templating)
- JWT Authentication
- Stripe API
- Mapbox GL JS
- Parcel Bundler

## Getting Started

### Prerequisites

- Node.js 12.x or higher
- MongoDB 4.0 or higher
- Stripe account
- Mapbox account
- Email service (SendGrid/Mailtrap)

### Installation

```bash
git clone https://github.com/N73311/natours.git
cd natours
npm install
```

### Configuration

Create `config.env` file:

```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours
DATABASE_PASSWORD=your_password
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=90d
STRIPE_SECRET_KEY=sk_test_your_key
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_username
EMAIL_PASSWORD=your_password
```

### Development

```bash
npm run start:dev
```

### Build

```bash
npm run build:js
npm start
```

## Project Structure

```
natours/
├── controllers/   # Route controllers
├── models/        # Mongoose models
├── routes/        # Express routes
├── views/         # Pug templates
├── public/        # Static assets
├── utils/         # Utility functions
├── app.js         # Express configuration
└── server.js      # Server entry point
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

## Author

Zachariah Ayers - [zachayers.io](https://zachayers.io)