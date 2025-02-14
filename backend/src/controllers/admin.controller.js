import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Guard } from "../models/guard.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const authoriseGuard = asyncHandler(async (req, res) => {
  const guardId = req.params;
  if(!guardId) {
    throw 
  }
});

const listUnauthorisedGuards = asyncHandler(async (req, res) => {

});


