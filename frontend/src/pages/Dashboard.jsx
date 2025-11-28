import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      Promise.resolve().then(() => setUser(parsed));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-4xl font-bold text-blue-600 mb-4 text-center">
          Dashboard
        </h2>

        <p className="text-lg text-bold  text-green-700 text-center mb-2">
          Welcome {user ? user.name : ""}...! 🎉
        </p>

        <p className="text-md text-gray-500 text-center mb-8">
          You are logged in successfully.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition text-white font-semibold px-6 py-3 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Feature Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Employees Card */}
          <Link
            to="/employees"
            className="p-6 bg-blue-50 border rounded-lg text-center shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-xl font-bold text-blue-700 mb-2">Employees</h3>
            <p className="text-gray-600">Manage all employees here</p>
          </Link>

          {/* Teams Card */}
          <Link
            to="/teams"
            className="p-6 bg-purple-50 border rounded-lg text-center shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-xl font-bold text-purple-700 mb-2">Teams</h3>
            <p className="text-gray-600">Track organisation teams</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
