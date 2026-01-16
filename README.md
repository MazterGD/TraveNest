# TraveNest 🚌

**Sri Lanka's Premier Vehicle Rental Marketplace**

TraveNest is a web-based vehicle rental marketplace platform designed to connect vehicle owners with customers seeking transportation services across Sri Lanka.

## 🏗️ Project Architecture

This is a **monorepo** managed with npm workspaces:

```
travenest/
├── apps/
│   ├── web/                 # Next.js 16 frontend
│   └── api/                 # Express.js backend API
├── packages/
│   ├── database/            # Prisma ORM & database schema
│   └── shared-types/        # Shared TypeScript types
└── package.json             # Root package.json with workspaces
```

## 🚀 Quick Start

```bash
# Install all dependencies
npm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database credentials

# Set up the database
npm run db:push      # Push schema to database
npm run db:seed      # Seed demo data (optional)

# Start development (frontend + backend)
npm run dev
```

| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start all services (web:3000, api:5000) |
| `npm run dev:web`   | Start frontend only                     |
| `npm run dev:api`   | Start backend only                      |
| `npm run build`     | Build all workspaces                    |
| `npm run db:studio` | Open Prisma Studio                      |

## ✨ Features

### For Customers

- Advanced search with filters (capacity, amenities, price, location)
- Standardized quotation requests with transparent cost breakdowns
- Multi-vendor comparison
- Secure online booking and payment
- Multilingual support (English, Sinhala, Tamil)
- Rating and review system

### For Bus Owners

- Self-registration with document verification
- Fleet management and availability calendars
- Automated quotation generation
- Performance analytics
- Direct customer communication

### For Admins

- Owner verification and approval workflows
- Dispute resolution
- Platform analytics and reporting
- System management

## 🛠️ Tech Stack

- **Frontend:** React/Next.js 15 with Tailwind CSS
- **Backend:** Node.js/Express with PostgreSQL
- **Authentication:** JWT
- **Payments:** PayHere
- **SMS/OTP:** Twilio
- **Storage:** AWS S3
- **Maps:** Google Maps API
- **PWA:** Progressive Web App capabilities

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles and Tailwind config
│   ├── layout.tsx               # Root layout
│   └── [locale]/                # Internationalized routes
│       ├── layout.tsx           # Locale layout with i18n provider
│       ├── page.tsx             # Home page
│       ├── login/               # Login page
│       ├── register/            # Registration page
│       ├── search/              # Vehicle search page
│       ├── about/               # About page
│       ├── contact/             # Contact page
│       ├── how-it-works/        # How it works page
│       ├── faq/                 # FAQ page
│       ├── privacy/             # Privacy policy
│       ├── terms/               # Terms of service
│       ├── refund-policy/       # Refund policy
│       └── dashboard/           # Customer dashboard (protected)
│           ├── layout.tsx       # Dashboard layout with sidebar
│           ├── page.tsx         # Dashboard overview
│           ├── quotations/      # Quotation management
│           │   ├── page.tsx     # Quotation requests list
│           │   └── new/         # New quotation request form
│           ├── bookings/        # Booking management
│           ├── reviews/         # Customer reviews
│           └── profile/         # Profile settings
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── MainLayout.tsx       # Public pages layout
│   │   └── LanguageSwitcher.tsx # i18n language selector
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx           # Button component
│   │   ├── Input.tsx            # Text input component
│   │   ├── TextArea.tsx         # Textarea component
│   │   ├── Select.tsx           # Custom select dropdown
│   │   ├── Card.tsx             # Card components
│   │   ├── Modal.tsx            # Modal dialog
│   │   ├── Tabs.tsx             # Tab navigation
│   │   ├── Badge.tsx            # Status badges
│   │   ├── Avatar.tsx           # User avatars
│   │   ├── DatePicker.tsx       # Date/time pickers
│   │   ├── Accordion.tsx        # Expandable accordion
│   │   ├── PageHeader.tsx       # Page header component
│   │   ├── EmptyState.tsx       # Empty state displays
│   │   ├── Skeleton.tsx         # Loading skeletons
│   │   └── index.ts             # Barrel exports
│   └── features/                # Feature-specific components
│       └── customer/            # Customer portal components
│           ├── QuotationRequestForm.tsx  # Quotation request form
│           ├── QuotationCard.tsx         # Quotation display card
│           ├── QuotationRequestCard.tsx  # Request card component
│           ├── BookingCard.tsx           # Booking display card
│           ├── ReviewForm.tsx            # Review submission form
│           └── index.ts                  # Barrel exports
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useQuotations.ts        # Quotations management hook
│   ├── useBookings.ts          # Bookings management hook
│   ├── useUtils.ts             # Utility hooks (debounce, etc.)
│   └── index.ts                # Barrel exports
├── store/                       # Zustand state management
│   ├── authStore.ts            # Authentication state
│   ├── quotationStore.ts       # Quotation state
│   ├── bookingStore.ts         # Booking state
│   └── index.ts                # Barrel exports
├── lib/                         # Utility libraries
│   ├── utils/
│   │   └── cn.ts               # Class name utility
│   ├── api/
│   │   ├── client.ts           # HTTP API client
│   │   └── index.ts            # API exports
│   └── validations/
│       └── index.ts            # Zod validation schemas
├── types/                       # TypeScript definitions
│   └── index.ts                # Core type definitions
├── constants/                   # Application constants
│   └── index.ts                # App config, districts, etc.
├── i18n/                        # Internationalization
│   ├── request.ts              # next-intl config
│   └── locales/                # Translation files
│       ├── en/common.json      # English translations
│       ├── si/common.json      # Sinhala translations
│       └── ta/common.json      # Tamil translations
└── middleware.ts               # Next.js middleware (i18n routing)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Maps API key
- PayHere merchant account
- Twilio account
- AWS S3 bucket

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MazterGD/TraveNest.git
cd TraveNest
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration values.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Available Languages

The platform supports three languages:

- English (EN)
- Sinhala (SI)
- Tamil (TA)

Language can be switched from the navigation bar. URLs are automatically prefixed with the locale (e.g., `/en/`, `/si/`, `/ta/`).

## 📱 PWA Support

TravelNest is a Progressive Web App that can be installed on mobile devices and desktop computers for an app-like experience.

## 🎨 Styling

The project uses:

- **Tailwind CSS** for styling
- **Custom CSS variables** for theming
- **HSL color system** for consistent color management
- **Responsive design** with mobile-first approach

### Brand Colors

- **Primary:** Deep Blue (#00476B) - Main brand color, trust and reliability
- **Secondary:** Muted Blue (#2F6280) - Secondary actions and text
- **Accent:** Light Blue (#6ACAF0) - Interactive elements and highlights
- **Muted:** Soft Cyan (#C9E9F8) - Backgrounds and subtle elements
- **Card:** Very Light Blue (#DAF3FB) - Card backgrounds

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters of this project

## 📧 Contact

For questions or support, please contact [support@travenest.lk](mailto:support@travenest.lk)

---

**Built with ❤️ for Sri Lanka**
