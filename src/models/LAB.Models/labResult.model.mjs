import { Schema, model } from "mongoose";
import { getCreatedOn } from "../../constants.mjs";

const labResult = new Schema({
  mrNo: { type: String, required: true },
  labNo: { type: String, required: true },
  createdUser: { type: String, required: true },
  createdOn: { type: String, default: getCreatedOn() },
  resultDepart: { type: String, required: true },
  resultData: { type: Array, required: true },
  updatedUser: { type: String },
  updatedOn: { type: String },
  testName: { type: String, required: true },
  testId: { type: String, required: true },
});

export const labResultModel = model("LabResult", labResult);

const microscopyResult = new Schema({
  mrNo: { type: String, required: true },
  labNo: { type: String, required: true },
  createdUser: { type: String, required: true },
  createdOn: { type: String, default: getCreatedOn() },
  resultDepart: { type: String, required: true },
  updatedUser: { type: String },
  updatedOn: { type: String },
  testName: { type: String, required: true },
  testId: { type: String, required: true },
  specimen: { type: String },
  znStain: { type: String },
  microscopy: { type: Array },
  culture: { type: Array },
  gramStain: { type: Array },
  microscopyData: { type: Array },
  organism: { type: Array },
});

export const microscopyResultModel = model(
  "microscopyResult",
  microscopyResult
);
