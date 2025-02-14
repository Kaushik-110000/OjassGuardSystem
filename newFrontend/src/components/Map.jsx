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
import locationservice from "../backend/location.config.js";
import guardService from "../backend/guard.config.js";

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
      map.setView(center, 25); // Update map center & zoom level
    }
  }, [center, map]);
  return null;
}

function Map() {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const [loading, setLoading] = useState(false);
  const [guards, setGuards] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([51.505, -0.09]);

  // Fetch Guard Locations
  useEffect(() => {
    guardService
      .ListGuard()
      .then((res) => {
        const validGuards = res?.data?.data?.filter(
          (guard) =>
            guard.latitude !== undefined && guard.longitude !== undefined
        ); // ✅ Filter out invalid data
        setGuards(validGuards);
        console.log("Filtered Guards Data:", validGuards);
      })
      .catch((error) => console.error("Error fetching guards:", error));
  }, []);

  // Handle location search
  const handleLocationSearch = async (locationName) => {
    try {
      setLoading(true);
      const res = await locationservice.getLocationCoordinates({
        location: locationName,
      });
      if (res?.data?.data) {
        const { latitude, longitude } = res.data.data;
        setMapCenter([parseFloat(latitude), parseFloat(longitude)]);
        console.log("Updated Map Center:", latitude, longitude);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        📍 Location Tracker
      </h1>

      {/* Search Bar */}
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

      {/* Map Container */}
      <div className="w-3/4 h-[500px] rounded-xl overflow-hidden shadow-lg">
        <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
          <ChangeView center={mapCenter} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Clickable Marker */}
          <LocationMarker
            onLocationSelect={(lat, lng) => {
              setSelectedLocation([lat, lng]);
              console.log("Selected Location:", lat, lng);
            }}
          />

          {/* ✅ Guard Markers (Fixed) */}
          {guards.map((guard, index) => (
            <Marker
              key={index}
              position={[
                parseFloat(guard.latitude),
                parseFloat(guard.longitude),
              ]}
            >
              <Popup>
                🛡️ Guard: {guard.fullName} <br />
                📍 Location: {guard.latitude}, {guard.longitude} <br />
                📧 Email: {guard.email} <br />
                <img
                  src={guard.avatar}
                  alt={guard.fullName}
                  className="w-16 h-16 rounded-full mt-2"
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
