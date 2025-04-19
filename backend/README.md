# Freelancing Platform API

A comprehensive backend API for a freelancing platform built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Registration, authentication, profile management
- **Job Management**: Posting, bidding, filtering, and searching
- **Messaging System**: Real-time communication between clients and freelancers
- **Payment System**: Secure payment handling with escrow functionality
- **Review System**: Feedback and rating mechanism
- **Admin Dashboard**: User management, content moderation, statistics

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@yourapp.com
   ```

## Running the API

### Development
```
npm run dev
```

### Production
```
npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get token
- `GET /api/auth/me`: Get current user
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password/:token`: Reset password
- `GET /api/auth/verify-email/:token`: Verify email address

### User Endpoints
- `GET /api/users/:id`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `PUT /api/users/change-role`: Switch between client and freelancer
- `GET /api/users/freelancers`: Get all freelancers with filtering

### Job Endpoints
- `POST /api/jobs`: Create a new job
- `GET /api/jobs`: Get all jobs with filtering
- `GET /api/jobs/:id`: Get job by ID
- `PUT /api/jobs/:id`: Update job
- `DELETE /api/jobs/:id`: Delete job

### Bid Endpoints
- `POST /api/bids`: Submit a bid
- `GET /api/bids/job/:jobId`: Get all bids for a job
- `GET /api/bids/my-bids`: Get freelancer's own bids
- `PUT /api/bids/:id`: Update bid
- `DELETE /api/bids/:id/withdraw`: Withdraw bid

### Payment Endpoints
- `POST /api/payments/escrow`: Create escrow payment
- `PUT /api/payments/:id/release`: Release payment
- `GET /api/payments/client`: Get client payments
- `GET /api/payments/freelancer`: Get freelancer earnings

### Message Endpoints
- `GET /api/messages/conversations`: Get all conversations
- `GET /api/messages/conversations/:id`: Get messages in a conversation
- `POST /api/messages`: Send a message

### Review Endpoints
- `POST /api/reviews`: Create a review
- `GET /api/reviews/user/:userId`: Get user reviews
- `GET /api/reviews/job/:jobId`: Get job reviews