import express from "express";
import { AddServiceChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/AddServiceChargesModel.mjs";
import { ConsultantVisitModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/ConsultantVisitModel.mjs";
import { ProcedureChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/ProcedureChargesModel.mjs";
import { AdmissionWardChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/wardChargesModel.mjs";
import { PaymentRecieptModel } from "../../../DBRepo/IPD/PaymenModels/PaymentRecieptModel.mjs";
import { PatientRegModel } from "../../../DBRepo/IPD/PatientModel/PatientRegModel.mjs";
import {
  AdmissionPartyModel,
  AdmissionWardModel,
} from "../../../DBRepo/IPD/PatientModel/AdmissionDetails/PartyModel.mjs";
import { AdmissionModel } from "../../../DBRepo/IPD/PatientModel/AdmissionDetails/AdmissionModel.mjs";

const router = express.Router();

router.get("/runningbill", async (req, res) => {
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

    // Deposit Details
    const depositDetails = await PaymentRecieptModel.find({
      paymentAgainst: "Advance Admission",
      againstNo: admissionNo,
      isDelete: false,
    });

    //Admission data
    const admissionData = await AdmissionModel.find({ admissionNo });
    res.status(200).send({
      data: {
        patientData,
        activeParty,
        activeWard,
        serviceCharges,
        consultantVisit,
        procedureCharges,
        wardCharges,
        admissionData,
        depositDetails: depositDetails,
      },
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
