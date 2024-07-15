import express from "express";
import { RadiologyBookingModel } from "../../../DBRepo/Radiology/Transaction/RadiologyBookingModel.mjs";
import { PaymentRecieptModel } from "../../../DBRepo/IPD/PaymenModels/PaymentRecieptModel.mjs";
import { PatientRegModel } from "../../../DBRepo/IPD/PatientModel/PatientRegModel.mjs";
import moment from "moment-timezone";
import { resetCounter } from "../../General/ResetCounter/ResetCounter.mjs";

const router = express.Router();

router.post("/radiologybooking", async (req, res) => {
  try {
    const {
      mrNo,
      consultant,
      party,
      remarks,
      amount,
      paymentType,
      location,
      serviceDetails,
      createdUser,
      shiftNo,
    } = req.body;

    if (
      ![
        mrNo,
        consultant,
        party,
        amount,
        paymentType,
        location,
        serviceDetails,
        createdUser,
        shiftNo,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");
    const response = await RadiologyBookingModel.create({
      mrNo,
      consultant,
      party,
      remarks,
      amount,
      paymentType,
      location,
      serviceDetails,
      shiftNo,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    const payment = await PaymentRecieptModel.create({
      paymentType,
      location,
      paymentAgainst: "Radiology Bookinhg",
      amount,
      shiftNo,
      againstNo: response?.radiologyNo,
      mrNo,
      remarks,
      createdUser,
      createdOn: response?.createdOn,
    });
    res.status(200).send({ data: response, data2: payment });
  } catch (error) {
    res.status(400).send({ message: error.message, body: req.body });
  }
});

router.get("/radiologybooking", async (req, res) => {
  try {
    const { radiologyNo } = req.query;
    if (![radiologyNo].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await RadiologyBookingModel.find({ radiologyNo });

    if (response.length <= 0)
      throw new Error("NO SERVICES ADDED TO THIS PATIENT!!!");
    const flatData = response.flatMap((item) => item?.serviceDetails);
    const updatedData = flatData.filter((items) => items?.isDeleted !== true);
    res.status(200).send({ data: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/radiologyreverse", async (req, res) => {
  try {
    const { radiologyNo } = req.query;
    if (![radiologyNo].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await RadiologyBookingModel.find({ radiologyNo });

    if (response.length <= 0)
      throw new Error("NO SERVICES ADDED TO THIS PATIENT!!!");
    const flatData = response.flatMap((item) => item?.serviceDetails);
    const updatedData = flatData.filter((items) => items?.isDeleted !== false);
    res.status(200).send({ data: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/radiologybooking", async (req, res) => {
  try {
    const { uniqueId, deletedUser } = req.body;
    if (![uniqueId, deletedUser].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await RadiologyBookingModel.updateOne(
      { "serviceDetails.uniqueId": uniqueId },
      {
        $set: {
          "serviceDetails.$.isDeleted": true,
          "serviceDetails.$.deletedUser": deletedUser,
          "serviceDetails.$.deletedOn": moment(new Date())
            .tz("Asia/Karachi")
            .format("DD/MM/YYYY HH:mm:ss"),
          isRemain: true,
        },
      }
    );
    const update = await RadiologyBookingModel.find({
      "serviceDetails.uniqueId": uniqueId,
    });
    const checkData = update[0].serviceDetails.every(
      (items) => items?.isDeleted
    );
    if (checkData === true) {
      const finalupdate = await RadiologyBookingModel.updateOne(
        { "serviceDetails.uniqueId": uniqueId },
        { isDeletedAll: true }
      );
      res.status(200).send({ message: "Deleted Successfully" });
      return;
    }
    res.status(200).send({ Data: "Deleted Successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/radiologydetails", async (req, res) => {
  try {
    const response = await RadiologyBookingModel.find({ isDeletedAll: false });
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
      };
      return acc;
    }, {});

    // Step 4: Add patientName to the original response
    const updatedResponse = response.map((item) => ({
      _id: item._id,
      mrNo: item.mrNo,
      radiologyNo: item.radiologyNo,
      patientName: mrNoToPatientNameMap[item.mrNo]?.patientName,
      patientType: mrNoToPatientNameMap[item.mrNo]?.patientType,
      relativeType: mrNoToPatientNameMap[item.mrNo]?.relativeType,
      relativeName: mrNoToPatientNameMap[item.mrNo]?.relativeName,
      ageYear: mrNoToPatientNameMap[item.mrNo]?.ageYear,
      ageMonth: mrNoToPatientNameMap[item.mrNo]?.ageMonth,
      ageDay: mrNoToPatientNameMap[item.mrNo]?.ageDay,
      cellNo: mrNoToPatientNameMap[item.mrNo]?.cellNo,
      gender: mrNoToPatientNameMap[item.mrNo]?.gender,
    }));
    res.status(200).send({ data: updatedResponse });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/radiologydetailsforrefund", async (req, res) => {
  try {
    const response = await RadiologyBookingModel.find({ isRemain: true });
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
      };
      return acc;
    }, {});

    // Step 4: Add patientName to the original response
    const updatedResponse = response.map((item) => ({
      _id: item._id,
      mrNo: item.mrNo,
      radiologyNo: item.radiologyNo,
      patientName: mrNoToPatientNameMap[item.mrNo]?.patientName,
      patientType: mrNoToPatientNameMap[item.mrNo]?.patientType,
      relativeType: mrNoToPatientNameMap[item.mrNo]?.relativeType,
      relativeName: mrNoToPatientNameMap[item.mrNo]?.relativeName,
      ageYear: mrNoToPatientNameMap[item.mrNo]?.ageYear,
      ageMonth: mrNoToPatientNameMap[item.mrNo]?.ageMonth,
      ageDay: mrNoToPatientNameMap[item.mrNo]?.ageDay,
      cellNo: mrNoToPatientNameMap[item.mrNo]?.cellNo,
      gender: mrNoToPatientNameMap[item.mrNo]?.gender,
    }));
    res.status(200).send({ data: updatedResponse });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/deleteCollectionRadiology", async (req, res) => {
  try {
    const response = await RadiologyBookingModel.collection.drop();
    resetCounter("radiologyNo");

    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/manyupdatesradio", async (req, res) => {
  try {
    const response = await RadiologyBookingModel.updateMany(
      {},
      { isDeletedAll: false }
    );
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/paymentrefundradiology", async (req, res) => {
  try {
    const { uniqueId } = req.body;
    if (uniqueId.length <= 0) throw new Error("UNIQUE ID IS REQUIRED !!!");
    const response = await RadiologyBookingModel.updateMany(
      { "serviceDetails.uniqueId": { $in: uniqueId } },
      {
        $set: {
          "serviceDetails.$.refund": true,
          "serviceDetails.$.refundUser": refundUser,
          "serviceDetails.$.refundOn": moment(new Date())
            .tz("Asia/Karachi")
            .format("DD/MM/YYYY HH:mm:ss"),
          isRemain: false,
        },
      }
    );
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
