import express from "express";
import { PaymentRecieptModel } from "../../../DBRepo/IPD/PaymenModels/PaymentRecieptModel.mjs";
import moment from "moment-timezone";
import { PatientRegModel } from "../../../DBRepo/IPD/PatientModel/PatientRegModel.mjs";
const router = express.Router();

router.post("/paymentreciept", async (req, res) => {
  try {
    const {
      paymentType,
      location,
      paymentAgainst,
      amount,
      shiftNo,
      againstNo,
      mrNo,
      remarks,
      createdUser,
    } = req.body;
    if (
      ![
        againstNo,
        amount,
        createdUser,
        location,
        mrNo,
        paymentAgainst,
        paymentType,
        shiftNo,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await PaymentRecieptModel.create({
      againstNo,
      amount,
      createdUser,
      location,
      mrNo,
      paymentAgainst,
      paymentType,
      remarks,
      shiftNo,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message, data: req.body });
  }
});

router.get("/paymentreciept", async (req, res) => {
  try {
    const response = await PaymentRecieptModel.find({});
    const mrNos = response.map((item) => item.mrNo);
    const patientDetails = await PatientRegModel.find({ MrNo: { $in: mrNos } });
    const mrNoToPatientNameMap = patientDetails.reduce((acc, patient) => {
      acc[patient?.MrNo] = {
        patientName: patient?.patientName,
        patientType: patient?.patientType,
        relativeType: patient?.relativeType,
        relativeName: patient?.relativeName,
        ageYear: patient?.ageYear,
        ageMonth: patient?.ageMonth,
        ageDay: patient?.ageDay,
        gender: patient?.gender,
        cellNo: patient?.cellNo,
        address: patient?.address,
      };
      return acc;
    }, {});

    // Step 4: Add patientName to the original response
    const updatedResponse = response.map((item) => ({
      _id: item._id,
      mrNo: item.mrNo,
      againstNo: item.againstNo,
      amount: item.amount,
      createdUser: item.createdUser,
      createdOn: item.createdOn,
      location: item.location,
      paymentAgainst: item.paymentAgainst,
      paymentType: item.paymentType,
      remarks: item.remarks,
      shiftNo: item.shiftNo,
      paymentNo: item.paymentNo,
      patientName: mrNoToPatientNameMap[item.mrNo]?.patientName,
      patientType: mrNoToPatientNameMap[item.mrNo]?.patientType,
      relativeType: mrNoToPatientNameMap[item.mrNo]?.relativeType,
      relativeName: mrNoToPatientNameMap[item.mrNo]?.relativeName,
      ageYear: mrNoToPatientNameMap[item.mrNo]?.ageYear,
      ageMonth: mrNoToPatientNameMap[item.mrNo]?.ageMonth,
      ageDay: mrNoToPatientNameMap[item.mrNo]?.ageDay,
      cellNo: mrNoToPatientNameMap[item.mrNo]?.cellNo,
      gender: mrNoToPatientNameMap[item.mrNo]?.gender,
      address: mrNoToPatientNameMap[item.mrNo]?.address,
    }));
    res.status(200).send({ data: updatedResponse });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
