# TravelNest 🚌

**Sri Lanka's Premier Bus Rental Marketplace**

TravelNest is a web-based bus rental marketplace platform designed to connect bus owners with customers seeking group transportation services across Sri Lanka.

## 🌟 Features

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
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalized routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   ├── ui/               # Reusable UI components
│   ├── shared/           # Shared components
│   └── features/         # Feature-specific components
│       ├── customer/     # Customer portal components
│       ├── owner/        # Owner portal components
│       ├── admin/        # Admin portal components
│       └── public/       # Public pages components
├── lib/                  # Utility libraries
│   ├── utils/           # Utility functions
│   ├── api/             # API client
│   └── validations/     # Form validation schemas
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
├── store/               # State management
├── i18n/                # Internationalization
│   └── locales/         # Translation files (en, si, ta)
├── constants/           # Application constants
└── services/            # Business logic services
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

- **Primary:** Deep Orange (#EF5B0C) - Main brand color
- **Secondary:** Blue (#0073E6) - Trust and reliability
- **Accent:** Gold (#F5C000) - Highlights

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
