import mongoose from "mongoose";

const createShift = new mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  createdOn: { type: String, required: true },
  status: { type: Boolean, required: true },
  endedOn: { type: String },
});

export const ShiftModel = mongoose.model("Shifts", createShift);
