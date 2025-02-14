import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

axios.defaults.withCredentials = true;

const getCoordinates = asyncHandler(async (req, res) => {
  const { location } = req.body; // Extract location from request body

  if (!location) {
    return res.status(400).json(new ApiError("Location is required"));
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );

    if (response.data.length === 0) {
      return res.status(404).json(new ApiError("Location not found"));
    }

    const { lat, lon } = response.data[0]; // Extract latitude and longitude

    return res.json(new ApiResponse(200, { latitude: lat, longitude: lon }));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError("Failed to retrieve coordinates", error.message));
  }
});

export { getCoordinates };
