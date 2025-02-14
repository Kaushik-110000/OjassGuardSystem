import mongoose, { Schema } from "mongoose";
const attendanceRateSchema = new Schema({
  attendanceRate: {
    type: Number,
    required: true,
  },
  guard: {
    type: Schema.Types.ObjectId,
    ref: "Guard",
    required: true,
  },
});

export const AttendanceRate = mongoose.model(
  "AttendanceRate",
  attendanceRateSchema
);
