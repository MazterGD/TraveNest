import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-4 top-1/4 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
            <div className="absolute -right-4 top-1/3 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20" />
            <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/20" />
          </div>

          <div className="relative z-10 text-center">
            {/* 404 Number */}
            <div className="relative mb-8">
              <h1
                className="text-[150px] font-black leading-none text-transparent md:text-[200px]"
                style={{
                  background:
                    "linear-gradient(to right, #059669, #4f46e5, #9333ea)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                404
              </h1>
              {/* Decorative element */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <svg
                  className="h-24 w-24 text-emerald-500/20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            {/* Illustration */}
            <div className="mb-8">
              <svg
                className="mx-auto h-48 w-48 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Lost traveler / vehicle illustration */}
                <g
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={0.5}
                >
                  {/* Road */}
                  <path
                    d="M2 18h20"
                    className="text-gray-300 dark:text-gray-600"
                  />
                  <path
                    d="M4 18v-2h16v2"
                    className="text-gray-300 dark:text-gray-600"
                  />

                  {/* Vehicle body */}
                  <path
                    d="M7 14h10c1 0 1.5-.5 1.5-1.5V10c0-1-.5-2-2-2h-1l-1-2H9.5l-1 2h-1c-1.5 0-2 1-2 2v2.5c0 1 .5 1.5 1.5 1.5z"
                    className="text-emerald-500"
                    strokeWidth={1}
                  />

                  {/* Windows */}
                  <path
                    d="M9 10h6v2H9z"
                    className="text-indigo-400"
                    strokeWidth={0.75}
                  />

                  {/* Wheels */}
                  <circle
                    cx="9"
                    cy="14.5"
                    r="1.5"
                    className="text-gray-600 dark:text-gray-400"
                    strokeWidth={1}
                  />
                  <circle
                    cx="15"
                    cy="14.5"
                    r="1.5"
                    className="text-gray-600 dark:text-gray-400"
                    strokeWidth={1}
                  />

                  {/* Question marks */}
                  <text
                    x="4"
                    y="8"
                    className="text-2xl text-indigo-500"
                    fontSize="4"
                    fontWeight="bold"
                  >
                    ?
                  </text>
                  <text
                    x="18"
                    y="6"
                    className="text-2xl text-purple-500"
                    fontSize="3"
                    fontWeight="bold"
                  >
                    ?
                  </text>
                </g>
              </svg>
            </div>

            {/* Message */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
                Oops! Looks like you&apos;re lost
              </h2>
              <p className="mx-auto max-w-md text-gray-600 dark:text-gray-400">
                The page you&apos;re looking for seems to have taken a wrong
                turn. Don&apos;t worry, let&apos;s get you back on track!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25"
              >
                <span className="relative flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go Home
                </span>
              </Link>
            </div>

            {/* Help Links */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/en/vehicles"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Browse Vehicles
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link
                href="/en/login"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Sign In
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link
                href="/en/register"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 text-center text-sm text-gray-400 dark:text-gray-500">
            <p>TraveNest — Your Journey, Your Way</p>
          </div>
        </div>
      </body>
    </html>
  );
}
