import mongoose from "mongoose";

const consultant = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  pmdc: { type: String },
  address: { type: String },
  email: { type: String },
  cnic: { type: String, required: true },
  phone: { type: String },
  status: { type: Boolean, default: false },
  updatedUser: { type: String, required: true },
  updatedOn: { type: String },
});
export const ConsultantsModel = mongoose.model("Consultant New", consultant);
