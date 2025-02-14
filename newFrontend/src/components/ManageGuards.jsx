import { useEffect, useState } from "react";
import axios from "axios";
import adminservice from "../backend/admin.config";
import errorTeller from "../backend/errorTeller";

function ManageGuards({ darkMode }) {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuards = async () => {
      try {
        const guards = await adminservice.getUnauthorisedGuards();

        if (guards) {
          setGuards(guards.data.data);
          setLoading(false);
        }
      } catch (error) {
        setError(errorTeller(error));
        setLoading(false);
      }
    };
    fetchGuards();
  }, []);

  const handleApproval = async (id, isApproved) => {
    try {
      await adminservice.approveRejectGuards(id, isApproved);
      setGuards((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      alert("Failed to update guard status");
    }
  };

  if (loading) return <p>Loading guards...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className={`p-6 ${!darkMode ? "bg-gray-100" : "bg-black"} min-h-screen `}
    >
      <h2 className="text-2xl font-bold mb-4">Manage Guards</h2>
      <div
        className={` p-4 ${
          !darkMode ? "bg-gray-100" : "bg-black"
        } shadow rounded-lg`}
      >
        {guards.length === 0 ? (
          <p>No guards found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guards.map((guard) => (
                <tr key={guard._id} className="border">
                  <td className="border p-2">{guard.fullName}</td>
                  <td className="border p-2">{guard.email}</td>
                  <td className="border p-2">
                    {guard.isApproved ? "Approved" : "Pending"}
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleApproval(guard._id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleApproval(guard._id, false)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageGuards;
