import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ onLocationSelect }) {
  
  const [position, setPosition] = useState(null);

  // Capture user click and update marker position
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
        Latitude: {position[0]}, Longitude: {position[1]}
      </Popup>
    </Marker>
  );
}

function Map() {
  const handleLocationSelect = (lat, lng) => {
    console.log("Selected Coordinates:", { latitude: lat, longitude: lng });
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Clickable Marker */}
        <LocationMarker onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
}

export default Map;
