import express from "express";
import { IPDWardChargesModel } from "../../../DBRepo/IPD/Masters/WardChargesIPDModel.mjs";
import { AdmissionModel } from "../../../DBRepo/IPD/PatientModel/AdmissionDetails/AdmissionModel.mjs";
import moment from "moment-timezone";
import {
  AdmissionConsultantModel,
  AdmissionPartyModel,
  AdmissionWardModel,
} from "../../../DBRepo/IPD/PatientModel/AdmissionDetails/PartyModel.mjs";
import { AdmissionWardChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/wardChargesModel.mjs";
import { IPDBedModel } from "../../../DBRepo/IPD/Masters/IPDBebModel.mjs";
import { ReservationModel } from "../../../DBRepo/IPD/PatientModel/ReservationModel.mjs";
import { PatientRegModel } from "../../../DBRepo/IPD/PatientModel/PatientRegModel.mjs";

const router = express.Router();

router.post("/admission", async (req, res) => {
  console.log(" body", req.body);
  try {
    const {
      admissionType,
      mrNo,
      createdUser,
      remarks,
      referedBy,
      party,
      wardName,
      bedNo,
      bedId,
      consultantId,
      reservationNo,
    } = req.body;

    if (
      ![
        admissionType,
        mrNo,
        createdUser,
        bedNo,
        consultantId,
        wardName,
        bedId,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");

    const findActiveBeds = await IPDWardChargesModel.find({ wardName, party });
    if (findActiveBeds.length < 0)
      throw new Error(
        "THIS WARD IS NOT ACTIVE ON THIS PARTY KINDLY CONTACT TO YOUR IT TEAM !!!"
      );

    const filteredData = findActiveBeds[0].bedDetails.filter((items) => {
      return items.bedId.toString() === bedId.toString();
    });

    console.log("filteredData", filteredData[0].bedCharges);
    if (filteredData[0].status === false)
      throw new Error(
        "BED IS NOT ACTIVATED ON THIS PARTY KINDLY CONTACT TO YOUR IT TEAM !!!"
      );

    const mrAdmittedCheck = await IPDBedModel.find({
      mrNo,
      reserved: true,
    });
    if (mrAdmittedCheck.length > 0)
      throw new Error(
        `THIS PATIENT IS ALREADY ADMITTED IN ${mrAdmittedCheck[0]?.wardName} ON BED NO. ${mrAdmittedCheck[0]?.bedNumber}`
      );

    const admissionC = await AdmissionModel.create({
      admissionType,
      mrNo,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
      remarks,
      referedBy,
      reservationNo,
    });
    if (admissionC.length < 0) {
      throw new Error("PLEASE TRY LATER!!!");
    }
    let admNo = admissionC.admissionNo;
    console.log("admNo", admNo);

    const PartyC = await AdmissionPartyModel.create({
      party,
      activeOnAdmission: true,
      admissionNo: admNo,
      mrNo,
      createdUser,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    const wardC = await AdmissionWardModel.create({
      wardName,
      bedNo,
      admissionNo: admNo,
      bedId,
      mrNo,
      activeOnAdmission: true,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });

    const consultantC = await AdmissionConsultantModel.create({
      consultantId,
      activeOnAdmission: true,
      admissionNo: admNo,
      mrNo,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });

    const wardChargesC = await AdmissionWardChargesModel.create({
      wardName,
      bedNo,
      bedId,
      admissionNo: admNo,
      mrNo,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
      amount: filteredData[0].bedCharges,
    });

    const reserveBed = await IPDBedModel.findOneAndUpdate(
      { _id: bedId },
      {
        $set: {
          reserved: true,
          admissionNo: admNo,
          mrNo,
        },
      },
      { new: true }
    );

    if (reservationNo !== "") {
      const reservation = await ReservationModel.findOneAndUpdate(
        { reservationNo: reservationNo },
        {
          $set: {
            AdmissionStatus: true,
          },
        },
        { new: true }
      );
    }

    res
      .status(200)
      .send({ data: [admissionC, PartyC, wardC, consultantC, wardChargesC] });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/admission", async (req, res) => {
  try {
    const response = await AdmissionModel.find({ discharge: false });
    const mrNos = response.map((item) => item.mrNo);
    const patientDetails = await PatientRegModel.find({ MrNo: { $in: mrNos } });
    const mrNoToPatientNameMap = patientDetails.reduce((acc, patient) => {
      acc[patient?.MrNo] = {
        patientName: patient?.patientName,
        patientType: patient?.patientType,
        relativeType: patient?.relativeType,
        relativeName: patient?.relativeName,
        ageYear: patient?.ageYear,
        gender: patient?.gender,
        cellNo: patient?.cellNo,
      };
      return acc;
    }, {});

    // Step 4: Add patientName to the original response
    const updatedResponse = response.map((item) => ({
      _id: item._id,
      mrNo: item.mrNo,
      admissionNo: item.admissionNo,
      patientName: mrNoToPatientNameMap[item.mrNo]?.patientName,
      patientType: mrNoToPatientNameMap[item.mrNo]?.patientType,
      relativeType: mrNoToPatientNameMap[item.mrNo]?.relativeType,
      relativeName: mrNoToPatientNameMap[item.mrNo]?.relativeName,
      ageYear: mrNoToPatientNameMap[item.mrNo]?.ageYear,
      cellNo: mrNoToPatientNameMap[item.mrNo]?.cellNo,
      gender: mrNoToPatientNameMap[item.mrNo]?.gender,
    }));
    res.status(200).send({ data: updatedResponse });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/admissionbed", async (req, res) => {
  try {
    const { wardName } = req.query;
    if (!wardName) throw new Error("WARDNAME IS REQUIRED !!!");

    const response = await IPDBedModel.find({ wardName });
    if (response.length <= 0) throw new Error("NO PATIENT IN THIS WARD !!!");

    const idSet2 = response.map((items) => items._id.toString());

    const mrNos = response.map((item) => item.mrNo);
    const patientDetails = await PatientRegModel.find({ MrNo: { $in: mrNos } });
    const mrNoToPatientNameMap = patientDetails.reduce((acc, patient) => {
      acc[patient?.MrNo] = {
        patientName: patient?.patientName,
        patientType: patient?.patientType,
        relativeType: patient?.relativeType,
        relativeName: patient?.relativeName,
        ageYear: patient?.ageYear,
        gender: patient?.gender,
        cellNo: patient?.cellNo,
      };
      return acc;
    }, {});

    // Step 4: Add patientName to the original response
    const updatedResponse = response.map((item) => ({
      _id: item._id,
      mrNo: item.mrNo,
      admissionNo: item.admissionNo,
      bedNo: item?.bedNumber,
      wardName: item?.wardName,
      bedId: item?.bedId,
      patientName: mrNoToPatientNameMap[item.mrNo]?.patientName,
      patientType: mrNoToPatientNameMap[item.mrNo]?.patientType,
      relativeType: mrNoToPatientNameMap[item.mrNo]?.relativeType,
      relativeName: mrNoToPatientNameMap[item.mrNo]?.relativeName,
      ageYear: mrNoToPatientNameMap[item.mrNo]?.ageYear,
      cellNo: mrNoToPatientNameMap[item.mrNo]?.cellNo,
      gender: mrNoToPatientNameMap[item.mrNo]?.gender,
    }));
    res.status(200).send({ data: updatedResponse });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
export default router;
