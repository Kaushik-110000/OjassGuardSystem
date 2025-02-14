import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  feedBack: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  recepient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  guard: {
    type: Schema.Types.ObjectId,
    ref: "Guard",
    required: true,
  },
});
export const Review = mongoose.model("Review", reviewSchema);
