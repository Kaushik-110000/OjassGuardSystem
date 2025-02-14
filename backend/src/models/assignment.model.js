import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema({
  guard: {
    type: Schema.Types.ObjectId,
    ref: "Guard",
    required: true,
  },
});
export const Assignment = mongoose.model("Assignment", assignmentSchema);
