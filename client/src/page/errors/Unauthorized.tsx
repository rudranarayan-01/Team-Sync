import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">

        {/* Animated Shield */}
        <div className="relative mx-auto w-32 h-32 mb-6 animate-float">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-300 to-orange-300 shadow-xl"></div>
          <div className="absolute inset-2 bg-white rounded-2xl flex items-center justify-center">
            <span className="text-5xl">🛡️</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3 text-gray-900">Access Denied</h1>
        <p className="text-gray-500 text-lg mb-8">
          You don’t have permission to view this page. Please login or go back.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold shadow hover:bg-red-600 transition"
          >
            Go to Login
          </Link>

          <Link
            to="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow hover:bg-gray-200 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
