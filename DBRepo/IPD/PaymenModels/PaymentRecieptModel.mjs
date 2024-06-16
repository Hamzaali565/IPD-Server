import mongoose from "mongoose";

import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const paymentReciept = new mongoose.Schema({
  paymentType: { type: String, required: true },
  location: { type: String, required: true },
  paymentAgainst: { type: String, required: true },
  paymentNo: { type: Number, unique: true },
  amount: { type: Number, required: true },
  shiftNo: { type: String, required: true },
  againstNo: { type: String, required: true },
  mrNo: { type: String, required: true },
  remarks: { type: String },
  createdUser: { type: String, required: true },
  createdOn: { type: String, required: true },
});

paymentReciept.plugin(AutoIncrement, { inc_field: "paymentNo" });

export const PaymentRecieptModel = mongoose.model(
  "PaymentReciept",
  paymentReciept
);
