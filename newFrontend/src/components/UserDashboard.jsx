import { useState, useEffect } from "react";
import axios from "axios";
import guardService from "../backend/guard.config";

function UserDashboard() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [selectedGuard, setSelectedGuard] = useState(null);

  useEffect(() => {
    async function fetchGuards() {
      try {
        const res = await guardService.ListGuard();
        console.log(res);

        setGuards(res.data);
      } catch (err) {
        setError("Failed to fetch guards");
      } finally {
        setLoading(false);
      }
    }
    fetchGuards();
  }, []);

  const handleComplaintSubmit = async (guardId) => {
    if (!complaint.trim()) return alert("Complaint cannot be empty");
    try {
      await axios.post(`/api/complaints`, {
        guardId,
        complaint,
      });
      alert("Complaint submitted successfully");
      setComplaint("");
      setSelectedGuard(null);
    } catch (error) {
      alert("Failed to submit complaint");
    }
  };

  if (loading) return <p>Loading guards...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">All Guards</h2>
      <div className="bg-white p-4 shadow rounded-lg">
        {guards.length === 0 ? (
          <p>No guards found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
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
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedGuard(guard._id)}
                    >
                      Lodge Complaint
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedGuard && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Lodge a Complaint</h3>
          <textarea
            className="w-full p-2 border rounded"
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
    </div>
  );
}

export default UserDashboard;
