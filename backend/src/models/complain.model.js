import mongoose, { Schema } from "mongoose";
const complainSchema = new Schema({
  complain: {
    type: String,
    required: true,
  },
  guard: {
    type: mongoose.Types.ObjectId,
    ref: "Guard",
  },
});

export const Complain = mongoose.model("Complain", complainSchema);
