import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import livelocservice from "../backend/liveloc.config.js";
import locationservice from "../backend/location.config.js";

// Custom icons for map markers
const blueIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [30, 30],
});

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [30, 30],
});

// Change View component to dynamically center map
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 50);
    }
  }, [center, map]);
  return null;
}

function Liveloc({ locationId }) {
  console.log("Location ID is:", locationId);

  if (!locationId) return <p>No location ID provided.</p>;

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [assignment, setAssignment] = useState(null);

  // Function to get user's live location
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          sendLocationToServer(latitude, longitude);
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Send live location to the backend
  const sendLocationToServer = async (lat, lng) => {
    try {
      const response = await livelocservice.sendLocation({
        latitude: lat,
        longitude: lng,
      });
      console.log("Location sent:", response);
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  // Fetch assignment location from backend
  useEffect(() => {
    locationservice.getSingleAssignment(locationId).then((res) => {
      console.log("Assignment Data:", res.data.data);
      setAssignment(res.data.data);
    });
  }, [locationId]);

  // Fetch live location every 4.5 seconds
  useEffect(() => {
    getLocation();
    const interval = setInterval(getLocation, 4);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        📍 Live Location Tracker
      </h2>

      <div className="w-3/4 h-[500px] rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={50}
          className="h-full w-full"
        >
          <ChangeView
            center={
              location.latitude
                ? [location.latitude, location.longitude]
                : [40.7128, -74.006]
            }
          />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Live User Location (Blue Marker) */}
          {location.latitude && location.longitude && (
            <Marker
              position={[location.latitude, location.longitude]}
              icon={blueIcon}
            >
              <Popup>
                🏃 Your Live Location <br />
                📍 {location.latitude}, {location.longitude}
              </Popup>
            </Marker>
          )}

          {/* Assigned Guard Location (Red Marker) */}
          {assignment && assignment.latitude && assignment.longitude && (
            <Marker
              position={[assignment.latitude, assignment.longitude]}
              icon={redIcon}
            >
              <Popup>
                🛡️ Assigned Location <br />
                📍 {assignment.latitude}, {assignment.longitude} <br />⏳
                Duration: {assignment.duration} hour(s)
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default Liveloc;
