import mongoose, { Schema } from "mongoose";
const locationSchema = new Schema(
  {
    guard: {
      type: mongoose.Types.ObjectId,
      ref: "Guard",
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);
