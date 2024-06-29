import express from "express";
import { AddServiceChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/AddServiceChargesModel.mjs";
import { ConsultantVisitModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/ConsultantVisitModel.mjs";
import { ProcedureChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/ProcedureChargesModel.mjs";
import { AdmissionWardChargesModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/wardChargesModel.mjs";

const router = express.Router();

router.get("/runningbill", async (req, res) => {
  try {
    const { admissionNo } = req.query;
    if (!admissionNo) throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
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

    res
      .status(200)
      .send({
        data: {
          serviceCharges,
          consultantVisit,
          procedureCharges,
          wardCharges,
        },
      });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
