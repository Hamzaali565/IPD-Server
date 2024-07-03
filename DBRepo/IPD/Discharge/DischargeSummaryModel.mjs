import mongoose from "mongoose";

const dischargeSummary = new mongoose.model({
  mrMo: { trpe: String, required: true },
  admissionNo: { trpe: String, required: true },
});
