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
import locationservice from "../backend/location.config";

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
        Latitude: {position[0]}, Longitude: {position[1]}
      </Popup>
    </Marker>
  );
}

// Component to update the map view
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13); // Update map center & zoom level
    }
  }, [center, map]);
  return null;
}

function Map() {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([51.505, -0.09]);
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
    <div style={{ height: "500px", width: "100%" }}>
      <input
        type="text"
        placeholder="Enter location"
        onBlur={(e) => handleLocationSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />
      {loading && <p>Loading location...</p>}

      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={mapCenter} /> 
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          onLocationSelect={(lat, lng) => {
            setSelectedLocation([lat, lng]);
            console.log("hi", selectedLocation);
          }}
        />
      </MapContainer>
    </div>
  );
}

export default Map;
