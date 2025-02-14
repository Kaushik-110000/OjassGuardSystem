import mongoose, { Schema } from "mongoose";

const appreciationSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  guard: {
    type: mongoose.Types.ObjectId,
    ref: "Guard",
  },
});

export const Appreciation = mongoose.model("Appreciation", appreciationSchema);
