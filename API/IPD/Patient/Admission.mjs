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
        "THIS WARD IS NOT ACTIVE ON THIS PARTY PLEASE CONTACT TO YOUR IT DEPARTMENT"
      );

    const filteredData = findActiveBeds[0].bedDetails.filter((items) => {
      return items.bedId.toString() === bedId.toString();
    });

    console.log("filteredData", filteredData[0].bedCharges);
    if (filteredData[0].status === false)
      throw new Error(
        "BED IS NOT ACTIVATED ON THIS PARTY PLAEASE CONTACT TO YOUR IT DEPARTMENT !!!"
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
        },
      },
      { new: true }
    );

    res
      .status(200)
      .send({ data: [admissionC, PartyC, wardC, consultantC, wardChargesC] });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
