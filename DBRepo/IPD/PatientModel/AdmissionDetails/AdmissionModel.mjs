import mongoose from "mongoose";

import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const admissionSchema = new mongoose.Schema({
  admissionType: { type: String, required: true },
  mrNo: { type: String, required: true },
  admissionNo: { type: Number, unique: true },
  createdUser: { type: String, required: true },
  createdOn: { type: String, required: true },
  updatedUser: { type: String },
  updatedOn: { type: String },
  remarks: { type: String },
  referedBy: { type: String },
  dischargeSummary: { type: Boolean, default: false },
  discharge: { type: Boolean, default: false },
  billingLock: { type: Boolean, default: false },
});

admissionSchema.plugin(AutoIncrement, { inc_field: "admissionNo" });

export const AdmissionModel = mongoose.model("AdmissionModel", admissionSchema);
