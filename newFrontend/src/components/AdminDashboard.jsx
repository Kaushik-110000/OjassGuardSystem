import { useState, useEffect } from "react";
import ManageGuards from "./ManageGuards";
import { FiLogOut, FiSun, FiMoon, FiShield } from "react-icons/fi";
import authservice from "../backend/auth.config";
import { useNavigate } from "react-router";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("manageGuards");
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authservice.logoutUser();
    navigate("/user/login");
  };

  const handleTakeAdminToUser = async () => {
    const user = await authservice.getCurrentUser();

    if (user.role === "admin") {
      navigate(`/user/u/${user._id}`);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`flex w-screen min-h-screen  transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-72 h-screen p-6 flex flex-col justify-between transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900"
            : "bg-gradient-to-b from-blue-800 to-blue-900 text-white"
        } shadow-xl rounded-r-lg`}
      >
        <div>
          {/* Dashboard Logo / Header */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <FiShield size={28} className="text-yellow-500" />
            <h2 className="text-3xl font-extrabold tracking-wide">Admin</h2>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center w-full py-3 mb-6 rounded-lg text-lg font-semibold transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white shadow-md"
          >
            {darkMode ? (
              <FiSun size={20} className="mr-2 text-yellow-400" />
            ) : (
              <FiMoon size={20} className="mr-2 text-gray-200" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Navigation */}
          <nav>
            <ul>
              <li
                className={`p-3 rounded-lg text-lg font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                  activeTab === "manageGuards"
                    ? darkMode
                      ? "bg-gray-700 text-white shadow-lg scale-105"
                      : "bg-blue-700 text-white shadow-lg scale-105"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("manageGuards")}
              >
                <FiShield size={20} />
                Manage Guards
              </li>
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleTakeAdminToUser}
          className="flex items-center justify-center space-x-2 w-full py-3 text-lg font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-md"
        >
          <span>User Dashboard</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full py-3 text-lg font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-md"
        >
          <FiLogOut size={22} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1  transition-all duration-300">
        {activeTab === "manageGuards" && <ManageGuards darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default AdminDashboard;
