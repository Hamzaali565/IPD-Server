import mongoose from "mongoose";

const IPDBed = new mongoose.Schema({
  wardName: { type: String, required: true },
  bedNumber: { type: String, required: true },
  createdOn: { type: String, required: true },
  user: { type: String, required: true },
  reserved: { type: Boolean },
});

export const IPDBedModel = mongoose.model("IPD Beds", IPDBed);
