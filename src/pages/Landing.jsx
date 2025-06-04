import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Welcome to Cleanify</h1>
        <p className="mb-6 text-gray-600">Choose your login type</p>
        <div className="flex justify-center gap-6">
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
              👤 User Login
            </button>
          </Link>
          <Link to="/admin-login">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
              🛠️ Admin Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
