import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
  FiHome,
  FiSettings,
  FiBell,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import authService from "../backend/auth.config.js";
import guardService from "../backend/guard.config.js";
import LiveLock from "../components/Liveloc.jsx";
function GuardDashboard() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const [deploymentId, setDeploymentID] = useState(null);
  const handleLogout = async () => {
    await authService.logoutGuard();
    navigate("/guard/login");
  };

  useEffect(() => {
    guardService.getSingleGuardAssignment().then((res) => {
      setDeploymentID(res.data?.data[0]?._id);
    });
  });

  return (
    <div
      className={`min-h-screen w-screen flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <aside
        className={`w-64 p-6 flex flex-col justify-between shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <nav className="space-y-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 w-full p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <FiHome size={20} />
              <span>Home</span>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-2 w-full p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <FiUser size={20} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-2 w-full p-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <FiSettings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">
            Welcome, {user?.fullName} 👋
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md bg-white"
          >
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-blue-500 text-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Attendance</h3>
            <p className="text-2xl">85%</p>
          </div>
          <div className="p-6 bg-green-500 text-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Tasks Completed</h3>
            <p className="text-2xl">12</p>
          </div>
          <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="text-2xl">3</p>
          </div>
        </div>
        {deploymentId ? <LiveLock locationId={deploymentId} /> : null}
        {/* Recent Activity */}
        <div
          className={`mt-8 ${
            darkMode ? "bg-black" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <FiBell size={20} className="text-blue-500" />
              <span>Checked in at 9:00 AM</span>
            </li>
            <li className="flex items-center space-x-3">
              <FiBell size={20} className="text-green-500" />
              <span>Completed Assignment 3</span>
            </li>
            <li className="flex items-center space-x-3">
              <FiBell size={20} className="text-yellow-500" />
              <span>Reminder: Meeting at 3 PM</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default GuardDashboard;
