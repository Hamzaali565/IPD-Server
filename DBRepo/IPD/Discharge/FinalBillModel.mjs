import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const finalBill = new mongoose.Schema({
  admissionNo: { type: String, required: true },
  mrNo: { type: String, required: true },
  admissionUser: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  dischargeUser: { type: String, required: true },
  dischargeDate: { type: Date, required: true },
  wardName: { type: String, required: true },
  bedNo: { type: String, required: true },
  totalBill: { type: Number, required: true },
  totalDeposit: { type: Number, default: 0 },
  totalRefund: { type: Number, default: 0 },
  totalRecievable: { type: Number, default: 0 },
  totalWard: { type: Number, default: 0 },
  totalProcedure: { type: Number, default: 0 },
  totalVisit: { type: Number, default: 0 },
  totalServices: { type: Number, default: 0 },
  totalMedicine: { type: Number, default: 0 },
  totalLab: { type: Number, default: 0 },
  totalRadiology: { type: Number, default: 0 },
  billNo: { type: Number, unique: true },
  billUser: { type: String, required: true },
  billDate: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
  deletedUser: { type: String, required: true },
  deletedOn: { type: String, required: true },
});

finalBill.plugin(AutoIncrement, { inc_field: "billNo" });

export const FinalBillModel = mongoose.model("FinalBill", finalBill);
