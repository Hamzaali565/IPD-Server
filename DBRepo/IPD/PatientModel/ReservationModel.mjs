import mongoose from "mongoose";

const reservation = new mongoose.Schema({
  mrNo: { type: String, required: true },
  fromdate: { type: String, required: true },
  toDate: { type: String, required: true },
  consultantId: { type: mongoose.ObjectId, required: true },
  shiftNo: { type: String, required: true },
  amount: { type: String, required: true },
  createdUser: { type: String, required: true },
  createdOn: { type: String, required: true },
  updatedUser: { type: String },
  updatedOn: { type: String },
});

export const ReservationModel = mongoose.model("Reservation", reservation);
