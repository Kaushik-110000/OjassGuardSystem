import mongoose, { Schema } from "mongoose";
const liveGuardSchema = new Schema({
  guard: {
    type: mongoose.Types.ObjectId,
    ref: "guards",
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});
export const LiveGuard = mongoose.model("LiveGuard", liveGuardSchema);
