import mongoose from "mongoose";

const WardChargeschema = new mongoose.Schema({
  wardName: { type: String, required: true },
  bedNo: { type: String, required: true },
  bedId: { type: mongoose.ObjectId, required: true },
  admissionNo: { type: String, required: true },
  mrNo: { type: String, required: true },
  createdUser: { type: String, required: true },
  createdOn: { type: String, required: true },
  isDeleted: { type: String, default: false },
  amount: { type: Number, required: true },
});

export const AdmissionWardChargesModel = mongoose.model(
  "AdmissionWardCharges",
  WardChargeschema
);
