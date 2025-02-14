import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import locationservice from "../backend/location.config.js";
import guardService from "../backend/guard.config.js";

// Define custom icon for assigned guards
const guardIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Example guard icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// Clickable Marker Component
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      console.log("Clicked Location:", lat, lng);
      onLocationSelect(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        📍 Latitude: {position[0]}, Longitude: {position[1]}
      </Popup>
    </Marker>
  );
}

// Update map view dynamically
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 25);
    }
  }, [center, map]);
  return null;
}

function Map() {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [loading, setLoading] = useState(false);
  const [guards, setGuards] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [assignedGuards, setAssignedGuards] = useState([]);

  useEffect(() => {
    guardService
      .ListUnassignedGuard()
      .then((res) => {
        const validGuards = res?.data?.data;
        setGuards(validGuards);
        console.log("Guards Data:", validGuards);
      })
      .catch((error) => console.error("Error fetching guards:", error));

    guardService
      .ListAssignedGuards()
      .then((res) => {
        setAssignedGuards(res.data.data);
        console.log("Assigned Guards:", res.data.data);

        if (res.data.data?.length > 0) {
          setMapCenter([res.data.data[0].latitude, res.data.data[0].longitude]);
        }
      })
      .catch((error) => {
        console.error("Error fetching assigned guards:", error);
      });
  }, []);

  const handleFinalSubmit = () => {
    if (!selectedLocation || !selectedGuard) {
      alert("Please select a location and a guard first.");
      return;
    }
    console.log("Final Submission:", {
      selectedLocation,
      selectedGuard,
    });

    locationservice
      .addAssignment({
        guardId: selectedGuard._id,
        latitude: selectedLocation[0],
        longitude: selectedLocation[1],
        from: "2025-02-14T08:00:00Z",
        to: "2025-02-14T10:00:00Z",
        duration: 6,
      })
      .then(() => {
        console.log("Assignment Added");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const handleUnassignMent = (e) => {
    locationservice
      .removeAssignment({ assignmentId: e.currentTarget.id })
      .then(() => {
        console.log("Assignment Removed");
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        📍 Location Tracker
      </h1>

      <div className="flex w-3/4 max-w-md mb-4">
        <input
          type="text"
          placeholder="Enter location..."
          onBlur={(e) => handleLocationSearch(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() =>
            handleLocationSearch(document.querySelector("input").value)
          }
          className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          🔍 Search
        </button>
      </div>

      {loading && (
        <p className="text-blue-600 font-semibold">⏳ Fetching location...</p>
      )}

      <div className="w-3/4 h-[500px] rounded-xl overflow-hidden shadow-lg">
        <MapContainer center={mapCenter} zoom={35} className="h-full w-full">
          <ChangeView center={mapCenter} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Clickable Marker */}
          <LocationMarker
            onLocationSelect={(lat, lng) => setSelectedLocation([lat, lng])}
          />

          {/* Assigned Guards Markers */}
          {assignedGuards.map((guard) => (
            <Marker
              key={guard.guardDetails._id}
              position={[guard.latitude, guard.longitude]}
              icon={guardIcon}
            >
              <Popup
                id={guard.guardDetails._id}
                onClick={console.log(guard.guardDetails._id)}
              >
                🛡️ {guard.guardDetails.fullName} <br />
                ✉️ {guard.guardDetails.email} <br />
                📍 {guard.latitude}, {guard.longitude}
                <button id={guard._id} onClick={handleUnassignMent}>
                  Remove
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* List of Guards */}
      <div className="w-3/4 max-w-md mt-4 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">🛡️ Select a Guard</h2>
        <ul>
          {guards.map((guard) => (
            <li
              key={guard.id}
              className={`p-2 cursor-pointer border-b hover:bg-gray-200 ${
                selectedGuard?.id === guard.id ? "bg-blue-300" : ""
              }`}
              onClick={() => setSelectedGuard(guard)}
            >
              {guard.fullName} ({guard.email})
            </li>
          ))}
        </ul>
      </div>

      {/* Final Submit Button */}
      <button
        onClick={handleFinalSubmit}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        ✅ Final Submit
      </button>

      {/* Assigned Guards List */}
      <div className="w-3/4 max-w-md mt-4 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">🛡️ Assigned Guards</h2>
        <ul>
          {assignedGuards.map((guard) => (
            <li key={guard.guardDetails._id} className="p-2 border-b">
              {guard.guardDetails.fullName} ({guard.guardDetails.email})
              <button
                id={guard._id}
                onClick={handleUnassignMent}
                className="ml-4 px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                ❌ Unassign
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Map;
