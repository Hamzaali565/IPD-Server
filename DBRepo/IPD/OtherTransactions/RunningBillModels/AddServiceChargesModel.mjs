import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const AddServiceCharges = new mongoose.Schema({
  admissionNo: { type: String, required: true },
  mrNo: { type: String, required: true },
  serviceNo: { type: Number, unique: true },
  createdOn: { type: String, required: true },
  serviceDetails: [
    {
      sreviceName: { type: String },
      serviceId: { type: mongoose.ObjectId },
      isdeleted: { type: Boolean, default: false },
      charge: { type: Number },
      createdUser: { type: String },
      deletedUser: { type: String },
      deletedOn: { type: String },
    },
  ],
});

AddServiceCharges.plugin(AutoIncrement, { inc_field: "serviceNo" });

export const AddServiceChargesModel = mongoose.model(
  "AddmissionServiceCharges",
  AddServiceCharges
);
