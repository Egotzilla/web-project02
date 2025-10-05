# Emerald River Cruise in Bangkok

A modern web-based booking system for a Bangkok river cruise experience. Built with Next.js, Material-UI, and MongoDB.

## Features

- **Customer Management**: Add, edit, and manage customer information
- **Booking System**: Create and manage cruise bookings with date and guest count
- **Review System**: Allow customers to leave ratings and reviews (1-5 stars)
- **Modern UI**: Beautiful Material-UI interface with responsive design
- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality for all entities

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **UI Library**: Material-UI (MUI) v7
- **Database**: MongoDB with Mongoose
- **Styling**: Material-UI theming with dark/light mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/bangkok-cruise
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── booking/        # Booking CRUD operations
│   │   ├── customer/       # Customer CRUD operations
│   │   └── review/         # Review CRUD operations
│   ├── components/         # Reusable UI components
│   ├── booking/           # Booking management page
│   ├── customers/         # Customer management page
│   ├── reviews/           # Review management page
│   └── page.js            # Home page
├── models/                # MongoDB models
│   ├── booking.js
│   ├── customer.js
│   └── review.js
├── lib/                   # Utility libraries
│   └── mongodb.js         # Database connection
└── context/               # Project documentation
    └── Proposal.md
```

## API Endpoints

### Customers
- `GET /api/customer` - Get all customers
- `POST /api/customer` - Create new customer
- `GET /api/customer/[id]` - Get customer by ID
- `PUT /api/customer/[id]` - Update customer
- `DELETE /api/customer/[id]` - Delete customer

### Bookings
- `GET /api/booking` - Get all bookings (with customer info)
- `POST /api/booking` - Create new booking
- `GET /api/booking/[id]` - Get booking by ID
- `PUT /api/booking/[id]` - Update booking
- `DELETE /api/booking/[id]` - Delete booking

### Reviews
- `GET /api/review` - Get all reviews (with customer info)
- `POST /api/review` - Create new review
- `GET /api/review/[id]` - Get review by ID
- `PUT /api/review/[id]` - Update review
- `DELETE /api/review/[id]` - Delete review

## Data Models

### Customer
- `name` (String, required)
- `email` (String, required, unique)
- `phone` (String, optional)

### Booking
- `customerId` (ObjectId, reference to Customer)
- `cruiseDate` (Date, required)
- `numberOfGuests` (Number, required)

### Review
- `customerId` (ObjectId, reference to Customer)
- `rating` (Number, required, 1-5)
- `comment` (String, required)

## Usage

1. **Home Page**: Overview of the Bangkok river cruise experience
2. **Manage Customers**: Add and manage customer information
3. **Manage Bookings**: Create and manage cruise bookings
4. **View Reviews**: See customer feedback and ratings

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Deployment

The application is designed to be deployed on a virtual machine. Make sure to:

1. Set up MongoDB (local or Atlas)
2. Configure environment variables
3. Build the application: `pnpm build`
4. Start the production server: `pnpm start`

## Contributing

This is a project for learning Next.js and full-stack development. Feel free to explore the code and experiment with new features!

## License

This project is for educational purposes.
