import { useState, useEffect } from "react";
import axios from "axios";
import guardService from "../backend/guard.config.js";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";
import authservice from "../backend/auth.config.js";

function UserDashboard() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [appreciation, setAppreciation] = useState("");
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [feedbackType, setFeedbackType] = useState(""); // "complaint" or "appreciation"
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await authservice.logoutUser();
    navigate("/user/login");
  };

  useEffect(() => {
    async function fetchGuards() {
      try {
        const res = await guardService.ListGuard();
        setGuards(res.data.data);
      } catch (err) {
        setError("Failed to fetch guards");
      } finally {
        setLoading(false);
      }
    }
    fetchGuards();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleComplaintSubmit = async (guardId) => {
    if (!complaint.trim()) return alert("Complaint cannot be empty");
    try {
      await guardService.lodgeComplaint(guardId, complaint);
      alert("Complaint submitted successfully");
      setComplaint("");
      setSelectedGuard(null);
      setFeedbackType("");
    } catch (error) {
      alert("Failed to submit complaint");
    }
  };

  const handleAppreciationSubmit = async (guardId) => {
    if (!appreciation.trim()) return alert("Appreciation message cannot be empty");
    try {
      await guardService.sendAppreciation(guardId, appreciation);
      alert("Appreciation submitted successfully");
      setAppreciation("");
      setSelectedGuard(null);
      setFeedbackType("");
    } catch (error) {
      alert("Failed to submit appreciation");
    }
  };

  if (loading) return <p>Loading guards...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Guards</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-700 text-white rounded"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div
        className={`p-4 shadow rounded-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {guards.length === 0 ? (
          <p>No guards found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guards.map((guard) => (
                <tr key={guard._id} className="border">
                  <td className="border p-2">{guard.fullName}</td>
                  <td className="border p-2">{guard.email}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedGuard(guard._id);
                        setFeedbackType("complaint");
                      }}
                    >
                      Lodge Complaint
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedGuard(guard._id);
                        setFeedbackType("appreciation");
                      }}
                    >
                      Submit Appreciation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedGuard && feedbackType === "complaint" && (
        <div
          className={`mt-6 p-4 shadow rounded-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Lodge a Complaint</h3>
          <textarea
            className={`w-full p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300"
            }`}
            placeholder="Enter your complaint here..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleComplaintSubmit(selectedGuard)}
          >
            Submit Complaint
          </button>
        </div>
      )}

      {selectedGuard && feedbackType === "appreciation" && (
        <div
          className={`mt-6 p-4 shadow rounded-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Submit an Appreciation</h3>
          <textarea
            className={`w-full p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300"
            }`}
            placeholder="Enter your appreciation message here..."
            value={appreciation}
            onChange={(e) => setAppreciation(e.target.value)}
          />
          <button
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => handleAppreciationSubmit(selectedGuard)}
          >
            Submit Appreciation
          </button>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
