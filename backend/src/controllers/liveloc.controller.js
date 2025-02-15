import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { LiveGuard } from "../models/liveGuard.model.js";

// Add new live location
const addLive = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  const guardId = req.user?._id;
  if (!guardId) {
    throw new ApiError(404, "User not found");
  }

  const data = await LiveGuard.create({ guard: guardId, latitude, longitude });
  if (!data) throw new ApiError(500, "Failed to create live location");

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Live location added"));
});

// Update existing live location
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
    { guard: guardId }, // Find by guard ID
    { latitude, longitude }, // Update coordinates
    { new: true, upsert: true } // Return updated doc, create if not exists
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Live location updated"));
});

// List all live guards (No Pagination)
const listLiveGuards = asyncHandler(async (req, res) => {
  const liveGuards = await LiveGuard.find({});

  if (!liveGuards.length) {
    throw new ApiError(404, "No live guards found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, liveGuards, "List of live guards"));
});

export { addLive, updateLive, listLiveGuards };
