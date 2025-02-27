import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Guard } from "../models/guard.model.js";
import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse.js";

const getRatings = asyncHandler(async (req, res) => {
  const data = await Guard.aggregate([
    {
      $lookup: {
        from: "complains",
        localField: "_id",
        foreignField: "guard",
        as: "Complaints",
      },
    },
    {
      $lookup: {
        from: "appreciations",
        localField: "_id",
        foreignField: "guard",
        as: "Appreciations",
      },
    },
    {
      $addFields: {
        Complaints: { $size: "$Complaints" },
        Appreciations: { $size: "$Appreciations" },
        Shift_Completion_Percentage: "$workPercent", // Default value
        Work_Experience_Years: {
          $floor: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60 * 24 * 365,
            ],
          },
        },
      },
    },
    {
      $project: {
        guard_id: "$_id",
        Complaints: 1,
        Appreciations: 1,
        Shift_Completion_Percentage: 1,
        Work_Experience_Years: 1,
      },
    },
  ]);

  console.log("Sending to ML API:", JSON.stringify(data, null, 2));

  try {
    const response = await axios.post(`http://127.0.0.1:5000/predict`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, response.data, "Guard data retrieved successfully")
      );
  } catch (error) {
    console.error("ML API Request Failed:", error.message);
    throw new ApiError(500, "Failed to retrieve ML prediction data");
  }
});

export { getRatings };
