import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-6">
      
      {/* Floating 404 */}
      <h1 className="text-[140px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 animate-float">
        404
      </h1>

      {/* Cute Ghost */}
      <div className="text-7xl mb-4 animate-bounce-slow">👻</div>

      <h2 className="text-3xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-gray-500 text-lg mb-8 text-center max-w-md">
        The page you're looking for doesn’t exist or may have moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
