import mongoose from "mongoose";

const IPDBed = new mongoose.Schema({
  wardName: { type: String, required: true },
  bedNumber: { type: String, required: true },
  createdOn: { type: String, required: true },
  user: { type: String, required: true },
  reserved: { type: Boolean },
  admissionNo: { type: String },
  mrNo: { type: String },
});

export const IPDBedModel = mongoose.model("IPD Beds", IPDBed);
