import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Guard } from "../models/guard.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Complain } from "../models/complain.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const authoriseGuard = asyncHandler(async (req, res) => {
  if (!req?.user?._id) {
    throw new ApiError(400, "Your ID is missing");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  if (user.role.toLowerCase() !== "admin") {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  const { guardId } = req.params;
  if (!guardId) throw new ApiError(400, "Guard ID is missing");

  const guard = await Guard.findById(guardId);
  if (!guard) throw new ApiError(404, "Guard not found");

  guard.isApproved = true; // Assuming this field exists
  await guard.save();

  // Find and delete complaints related to this guard
  const deletedComplaints = await Complain.deleteMany({ guard: guardId });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { guard, deletedComplaints },
        "Guard authorised successfully and related complaints deleted"
      )
    );
});

const rejectGuard = asyncHandler(async (req, res) => {
  if (!req?.user?._id) {
    throw new ApiError(400, "Your ID is missing");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  if (user.role.toLowerCase() !== "admin") {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  const { guardId } = req.params;
  if (!guardId) throw new ApiError(400, "Guard ID is missing");

  const guard = await Guard.findById(guardId);
  if (!guard) throw new ApiError(404, "Guard not found");

  const deletedGuard = await Guard.findByIdAndDelete(guardId);
  if (!deletedGuard) {
    throw new ApiError(404, "Guard deleted");
  }

  // Find and delete complaints related to this guard
  const deletedComplaints = await Complain.deleteMany({ guard: guardId });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { guard, deletedComplaints, deletedGuard },
        "Guard rejected successfully and related complaints deleted"
      )
    );
});

const listUnauthorisedGuards = asyncHandler(async (req, res) => {
  const unauthorisedGuards = await Guard.find({ isApproved: false }).select(
    "-password -refreshToken"
  );

  if (!unauthorisedGuards.length)
    throw new ApiError(404, "No unauthorised guards found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        unauthorisedGuards,
        "Unauthorised guards retrieved successfully"
      )
    );
});

export { authoriseGuard, listUnauthorisedGuards, rejectGuard };
