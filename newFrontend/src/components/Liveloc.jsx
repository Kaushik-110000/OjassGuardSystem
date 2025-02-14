import React, { useEffect, useState } from "react";
import livelocservice from "../backend/liveloc.config.js";
import locationservice from "../backend/location.config.js";

function Liveloc({ locationId }) {
  console.log("loc id is", locationId);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [assignment, setAssignment] = useState(null);
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

  useEffect(() => {
    locationservice.getSingleAssignment(locationId).then((res) => {
      console.log(res);
    });
  });

  useEffect(() => {
    getLocation();
    const interval = setInterval(getLocation, 450000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Location Updates</h2>
      {location.latitude && location.longitude ? (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default Liveloc;
