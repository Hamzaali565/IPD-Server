import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const radiologyBooking = new mongoose.Schema({
  radiologyNo: { type: Number, unique: true },
  mrNo: { type: String, required: true },
  consultant: { type: String, required: true },
  party: { type: String, required: true },
  remarks: { type: String },
  amount: { type: Number, required: true },
  paymentType: { type: String, required: true },
  location: { type: String, required: true },
  serviceDetails: [
    {
      serviceName: { type: String, required: true },
      quantity: { type: String, required: true },
      amount: { type: String, required: true },
      serviceId: { type: mongoose.ObjectId },
      uniqueId: { type: String, default: uuidv4 },
      isDeleted: { type: Boolean, default: false },
      deletedUser: { type: String },
      deletedOn: { type: String },
      refund: { type: Boolean, default: false },
      refundDate: { type: String },
    },
  ],
  createdUser: { type: String, required: true },
  createdOn: { type: String, required: true },
  isRemain: { type: Boolean, default: false },
  isDeletedAll: { type: Boolean, default: false },
});

radiologyBooking.plugin(AutoIncrement, { inc_field: "radiologyNo" });

export const RadiologyBookingModel = mongoose.model(
  "RadiologyBookingModel",
  radiologyBooking
);
