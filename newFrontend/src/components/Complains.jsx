import React, { useState, useEffect } from "react";
import adminservice from "../backend/admin.config";

function Complains({ guardId }) {
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!guardId) {
      setError("Invalid Guard ID");
      setLoading(false);
      return;
    }

    adminservice
      .listComplains(guardId)
      .then((res) => {
        setComplains(res.data.data);
      })
      .catch((err) => {
        setError("Failed to fetch complaints");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [guardId]);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="bg-black min-h-screen text-white flex justify-center items-center p-5">
      <div className="w-full max-w-3xl bg-gray-900 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center border-b border-gray-700 pb-3">Guard Complaints</h2>
        {complains.length === 0 ? (
          <p className="text-gray-400 text-center mt-5">No complaints found</p>
        ) : (
          <ul className="mt-5 space-y-4">
            {complains.map((complain) => (
              <li key={complain._id} className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700">
                <p className="text-gray-300">{complain.complain}</p>
                <p className="text-sm text-gray-500 mt-1">Complaint ID: {complain._id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Complains;
