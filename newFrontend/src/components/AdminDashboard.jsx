import { useState, useEffect } from "react";
import ManageGuards from "./ManageGuards";
import { FiLogOut } from "react-icons/fi";
import authservice from "../backend/auth.config";
import { useNavigate } from "react-router";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await authservice.logoutUser();
    navigate("/user/login");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`flex w-screen min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-64 p-4 ${
          darkMode ? "bg-gray-800" : "bg-blue-900 text-white"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-4 p-2 bg-gray-700 text-white rounded"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <nav>
          <ul>
            <li
              className={`p-2 cursor-pointer ${
                activeTab === "manageGuards"
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-blue-700"
                  : ""
              }`}
              onClick={() => setActiveTab("manageGuards")}
            >
              Manage Guards
            </li>
          </ul>
        </nav>
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
      <main className="flex-1 p-6">
        {activeTab === "manageGuards" && <ManageGuards darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default AdminDashboard;
