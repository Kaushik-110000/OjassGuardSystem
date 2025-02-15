import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { LiveGuard } from "../models/liveGuard.model.js";
// const
const addLive = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    throw new ApiError(404, "Cannot find latitude and longitude");
  }
  const guardId = req.user?._id;
  if (!guardId) {
    throw new ApiError(404, "User not found");
  }
  const data = await LiveGuard.create({ guard: guardId, latitude, longitude });
  if (!data) throw new ApiError(505, "Cannot build connection ");
  return res.status(200).json(new ApiResponse(200, data, "Created live"));
});

const updateLive = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  const guardId = req.user?._id;
  if (!guardId) {
    throw new ApiError(404, "User not found");
  }

  let data = await LiveGuard.findOneAndUpdate(
    { guard: guardId }, // Find the document based on guard ID
    { latitude, longitude }, // Update the coordinates
    { new: true, upsert: true } // Return updated doc, create if not exists
  );

  return res.status(200).json(new ApiResponse(200, data, "Updated live location"));
});

export { addLive, updateLive };
