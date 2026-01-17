# TraveNest API

Express.js backend API for the TraveNest vehicle rental management system.

## Quick Start

```bash
# From the root directory
npm install
npm run dev:api

# Or from this directory
npm run dev
```

## Project Structure

```
apps/api/
├── src/
│   ├── index.ts           # Server entry point
│   ├── app.ts             # Express app configuration
│   ├── config/            # Environment configuration
│   ├── middleware/        # Express middleware (auth, validation, error handling)
│   └── modules/           # Feature modules
│       ├── auth/          # Authentication (register, login, tokens)
│       ├── user/          # User management
│       ├── vehicle/       # Vehicle CRUD & search
│       ├── booking/       # Booking management
│       ├── quotation/     # Custom quotation requests
│       ├── review/        # Reviews & ratings
│       ├── payment/       # Stripe payment integration
│       └── notification/  # User notifications
├── .env.example           # Environment variables template
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/v1/auth/register`        | Register new user         |
| POST   | `/api/v1/auth/login`           | Login user                |
| POST   | `/api/v1/auth/refresh-token`   | Refresh access token      |
| POST   | `/api/v1/auth/logout`          | Logout user               |
| GET    | `/api/v1/auth/me`              | Get current user          |
| PUT    | `/api/v1/auth/change-password` | Change password           |
| POST   | `/api/v1/auth/forgot-password` | Request password reset    |
| POST   | `/api/v1/auth/reset-password`  | Reset password with token |

### Vehicles

| Method | Endpoint                            | Description                  |
| ------ | ----------------------------------- | ---------------------------- |
| GET    | `/api/v1/vehicles`                  | List vehicles (with filters) |
| GET    | `/api/v1/vehicles/:id`              | Get vehicle by ID            |
| GET    | `/api/v1/vehicles/:id/availability` | Check vehicle availability   |
| POST   | `/api/v1/vehicles`                  | Create vehicle (owner)       |
| PUT    | `/api/v1/vehicles/:id`              | Update vehicle (owner)       |
| DELETE | `/api/v1/vehicles/:id`              | Delete vehicle (owner)       |

### Bookings

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/v1/bookings/my-bookings`  | Get customer's bookings  |
| POST   | `/api/v1/bookings`              | Create booking           |
| GET    | `/api/v1/bookings/:id`          | Get booking details      |
| PATCH  | `/api/v1/bookings/:id/cancel`   | Cancel booking           |
| PATCH  | `/api/v1/bookings/:id/confirm`  | Confirm booking (owner)  |
| PATCH  | `/api/v1/bookings/:id/complete` | Complete booking (owner) |

### Quotations

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| GET    | `/api/v1/quotations/my-requests` | Get customer's quotations    |
| POST   | `/api/v1/quotations`             | Create quotation request     |
| PATCH  | `/api/v1/quotations/:id/respond` | Respond to quotation (owner) |
| PATCH  | `/api/v1/quotations/:id/accept`  | Accept quotation             |

### Reviews & Payments

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| GET    | `/api/v1/reviews/vehicle/:id`    | Get vehicle reviews          |
| POST   | `/api/v1/reviews`                | Create review                |
| POST   | `/api/v1/payments/create-intent` | Create Stripe payment intent |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
STRIPE_SECRET_KEY=sk_test_...
```

## Database

This API uses Prisma with PostgreSQL. Run migrations:

```bash
# From root directory
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes
npm run db:seed       # Seed demo data
npm run db:studio     # Open Prisma Studio
```

## Authentication

The API uses JWT tokens:

- **Access Token**: Short-lived (7 days), sent in Authorization header
- **Refresh Token**: Long-lived (30 days), stored in HTTP-only cookie

```typescript
// Request header
Authorization: Bearer<access_token>;
```

## Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build for production                     |
| `npm run start` | Start production server                  |
| `npm run lint`  | Run ESLint                               |
