import { useState, useEffect } from "react";
import ManageGuards from "./ManageGuards";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("");
  const [darkMode, setDarkMode] = useState(true);

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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "manageGuards" && <ManageGuards darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default AdminDashboard;
