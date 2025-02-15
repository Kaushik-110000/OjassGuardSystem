import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import livelocservice from "../backend/liveloc.config.js";
import locationservice from "../backend/location.config.js";

const blueIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [30, 30],
});

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [30, 30],
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

function Liveloc({ locationId }) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [assignment, setAssignment] = useState(null);
  const [insideCircle, setInsideCircle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalInsideTime, setTotalInsideTime] = useState(0);
  const [lastInsideTime, setLastInsideTime] = useState(null);
  const [outStartTime, setOutStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const radius = 65;

  useEffect(() => {
    locationservice.getSingleAssignment(locationId).then((res) => {
      setAssignment(res.data.data);
    });
  }, [locationId]);

  useEffect(() => {
    if (assignment) {
      const interval = setInterval(getLocation, 1000);
      return () => clearInterval(interval);
    }
  }, [assignment]);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          sendLocationToServer(latitude, longitude);

          if (assignment) {
            const inside = checkInsideCircle(
              latitude,
              longitude,
              assignment.latitude,
              assignment.longitude,
              radius
            );
            handleInsideOutsideTracking(inside);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const sendLocationToServer = async (lat, lng) => {
    try {
      await livelocservice.sendLocation({ latitude: lat, longitude: lng });
    } catch (error) {
      console.error("Error sending location:", error);
    }
  };

  const checkInsideCircle = (lat1, lon1, lat2, lon2, radius) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= radius;
  };

  const handleInsideOutsideTracking = (inside) => {
    const now = Date.now();

    if (inside) {
      setInsideCircle(true);
      if (outStartTime) setOutStartTime(null); // Reset out start time if coming back inside

      if (!lastInsideTime) setLastInsideTime(now);
    } else {
      setInsideCircle(false);
      if (!outStartTime) setOutStartTime(now); // Start tracking out duration
    }

    // If previously inside, calculate the time spent inside
    if (lastInsideTime && inside) {
      setTotalInsideTime((prev) => prev + (now - lastInsideTime));
      setLastInsideTime(now);
    }

    if (outStartTime && now - outStartTime > 120000) {
      handleOut(); // Trigger handleOut if outside for more than 2 minutes
    }

    updateProgress();
  };

  const updateProgress = () => {
    const now = Date.now();
    const fromTime = new Date(assignment.from).getTime();
    const toTime = new Date(assignment.to).getTime();
    const totalDuration = toTime - fromTime;
    console.log(now, toTime, totalDuration);
    if (now >= toTime) {
      handleComplete();
      return;
    }

    
    const insidePercentage = (totalInsideTime / totalDuration) * 100;
    setProgress(insidePercentage);
  };

  const handleComplete = () => {
    console.log(
      `✅ Work Completed. Inside Percentage: ${progress.toFixed(2)}%`
    );

    setIsCompleted(true);
  };

  const handleOut = () => {
    console.log("❌ User remained outside for too long! Taking action...");
    alert(
      "⚠️ Warning: You have been outside the assigned area for more than 2 minutes!"
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        📍 Live Location Tracker
      </h2>
      <div className="w-3/4 h-[500px] rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[22.775931, 86.1468165]}
          zoom={15}
          className="h-full w-full"
        >
          <ChangeView
            center={
              location.latitude
                ? [location.latitude, location.longitude]
                : [22.775931, 86.1468165]
            }
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {location.latitude && location.longitude && (
            <Marker
              position={[location.latitude, location.longitude]}
              icon={blueIcon}
            >
              <Popup>
                🏃 Your Live Location
                <br />
                📍 {location.latitude}, {location.longitude}
              </Popup>
            </Marker>
          )}
          {assignment && (
            <>
              <Marker
                position={[assignment.latitude, assignment.longitude]}
                icon={redIcon}
              >
                <Popup>
                  🛡️ Assigned Location
                  <br />
                  📍 {assignment.latitude}, {assignment.longitude}
                </Popup>
              </Marker>
              <Circle
                center={[assignment.latitude, assignment.longitude]}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.3,
                }}
                radius={radius}
              />
            </>
          )}
        </MapContainer>
      </div>
      <p className="mt-4 text-gray-700 font-semibold">
        Progress: {progress.toFixed(2)}%
      </p>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        className="mt-4 w-3/4"
        readOnly
      />
      {isCompleted && (
        <p className="text-green-600 font-bold">
          🎉 Work Completed Successfully!
        </p>
      )}
    </div>
  );
}

export default Liveloc;
