import express from "express";
import { FinalBillModel } from "../../../DBRepo/IPD/Discharge/FinalBillModel.mjs";
import { AdmissionModel } from "../../../DBRepo/IPD/PatientModel/AdmissionDetails/AdmissionModel.mjs";
import { AddServiceChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/AddServiceChargesModel.mjs";
import { ConsultantVisitModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/ConsultantVisitModel.mjs";
import { ProcedureChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/ProcedureChargesModel.mjs";
import { AdmissionWardChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/wardChargesModel.mjs";
import { PaymentRecieptModel } from "../../../DBRepo/IPD/PaymenModels/PaymentRecieptModel.mjs";
import { PatientRegModel } from "../../../DBRepo/IPD/PatientModel/PatientRegModel.mjs";
import {
  AdmissionConsultantModel,
  AdmissionPartyModel,
  AdmissionWardModel,
} from "../../../DBRepo/IPD/PatientModel/AdmissionDetails/PartyModel.mjs";

import { ConsultantsModel } from "../../../DBRepo/General/ConsultantModel/ConsultantModel.mjs";
import moment from "moment-timezone";
const router = express.Router();

router.post("/finalbill", async (req, res) => {
  try {
    const {
      admissionNo,
      mrNo,
      admissionUser,
      admissionDate,
      dischargeUser,
      dischargeDate,
      wardName,
      bedNo,
      totalBill,
      totalDeposit,
      totalRefund,
      totalRecievable,
      totalWard,
      totalProcedure,
      totalVisit,
      totalServices,
      totalMedicine,
      totalLab,
      totalRadiology,
      billUser,
    } = req.body;
    const checkBill = await FinalBillModel.find({
      admissionNo,
      isDelete: false,
    });
    if (checkBill.length > 0) throw new Error("Bill Already created!!!");
    const dischargeCheck = await AdmissionModel.find({
      admissionNo,
      discharge: true,
    });
    if (dischargeCheck.length == 0)
      throw new Error("Admission Not Discharged!!!");
    const response = await FinalBillModel.create({
      admissionNo,
      mrNo,
      admissionUser,
      admissionDate,
      dischargeUser,
      dischargeDate,
      wardName,
      bedNo,
      totalBill,
      totalDeposit,
      totalRefund,
      totalRecievable,
      totalWard,
      totalProcedure,
      totalVisit,
      totalServices,
      totalMedicine,
      totalLab,
      totalRadiology,
      billUser,
      billDate: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    const updateAdmission = await AdmissionModel.findOneAndUpdate(
      { admissionNo },
      {
        $set: {
          billFlag: true,
          billNo: response.billNo,
          billUser: response.billUser,
          billDate: response.billDate,
        },
      },
      { new: true }
    );
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
    console.log(error);
  }
});

router.put("/billdelete", async (req, res) => {
  try {
    const { admissionNo } = req.body;

    const response = await FinalBillModel.findOneAndUpdate(
      { admissionNo, isDelete: false },
      {
        $set: {
          isDelete: true,
          deletedOn: moment(new Date())
            .tz("Asia/Karachi")
            .format("DD/MM/YYYY HH:mm:ss"),
        },
      },
      { new: true }
    );
    const updateAdmission = await AdmissionModel.findOneAndUpdate(
      { admissionNo },
      { $set: { billFlag: false } },
      { new: true }
    );
    res.status(200).send({ data: "BILL DELETED SUCCESSFULLY!!!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/finalbill", async (req, res) => {
  try {
    const { admissionNo, mrNo } = req.query;
    if (!admissionNo || !mrNo)
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const patientData = await PatientRegModel.find({ MrNo: mrNo });

    const activeParty = await AdmissionPartyModel.find({
      admissionNo,
      activeOnAdmission: true,
    });

    const activeWard = await AdmissionWardModel.find({
      admissionNo,
      activeOnAdmission: true,
    });

    const activeConsultant = await AdmissionConsultantModel.find({
      admissionNo,
      activeOnAdmission: true,
    });
    const ConsultantName = await ConsultantsModel.find({
      _id: activeConsultant[0]?.consultantId,
    });
    // service Details
    const serviceChargesData = await AddServiceChargesModel.find({
      admissionNo,
    });
    const serviceFlat = serviceChargesData.flatMap(
      (item) => item.serviceDetails
    );
    const serviceCharges = serviceFlat.filter(
      (items) => items.isdeleted !== true
    );

    // consultant Visit
    const consultantVisit = await ConsultantVisitModel.find({
      admissionNo,
      isDeleted: false,
    });

    // procedure Charges
    const procedureCharges = await ProcedureChargesModel.find({
      admissionNo,
      isDeleted: false,
    });

    // Ward Charges
    const wardCharges = await AdmissionWardChargesModel.find({
      admissionNo,
      isDeleted: false,
    });

    //Admission data
    const admissionData = await AdmissionModel.find({ admissionNo });
    // Deposit Details
    const reservationNo = admissionData[0]?.reservationNo; // Using optional chaining to safely access reservationNo

    let query;

    if (reservationNo) {
      // If reservationNo exists, search for either admissionNo or reservationNo
      query = {
        $or: [
          {
            paymentAgainst: "Advance Admission",
            againstNo: admissionNo,
            isDelete: false,
          },
          {
            paymentAgainst: "Against Reservation",
            againstNo: reservationNo,
            isDelete: false,
          },
        ],
      };
    } else {
      // If reservationNo does not exist, search only for admissionNo
      query = {
        paymentAgainst: "Advance Admission",
        againstNo: admissionNo,
        isDelete: false,
      };
    }
    const depositDetails = await PaymentRecieptModel.find(query);

    const BilData = await FinalBillModel.find({ admissionNo, isDelete: false });
    res.status(200).send({
      data: {
        patientData,
        activeParty,
        activeWard,
        ConsultantName,
        serviceCharges,
        consultantVisit,
        procedureCharges,
        wardCharges,
        admissionData,
        depositDetails: depositDetails,
        BilData,
      },
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/billtorefund", async (req, res) => {
  try {
    const { billNo } = req.query;
    if (!billNo) throw new Error("BILL NO IS REQUIRED !!!");
    const billData = await FinalBillModel.findOne({ billNo, isDelete: false });
    if (billData.length <= 0) throw new Error("NO DATA FOUND !!!");
    res.status(200).send({ data: billData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/admissionmany", async (req, res) => {
  try {
    const response = await AdmissionModel.updateMany(
      {},
      { reAdmissionType: "" },
      { new: true }
    );
    res.status(200).send({ message: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
