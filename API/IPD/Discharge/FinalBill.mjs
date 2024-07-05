import express from "express";
import { FinalBillModel } from "../../../DBRepo/IPD/Discharge/FinalBillModel.mjs";
import { AdmissionModel } from "../../../DBRepo/IPD/PatientModel/AdmissionDetails/AdmissionModel.mjs";
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
    if (
      ![
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
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
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
          billNo: response[0].billNo,
          billUser: response[0].billUser,
          billDate: response[0].billDate,
        },
      },
      { new: true }
    );
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/billdelete", async (req, res) => {
  try {
    const { billNo } = req.body;

    const response = await FinalBillModel.findOneAndUpdate(
      { billNo },
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
      { billNo },
      { $set: { billFlag: false } },
      { new: true }
    );
    res.status(200).send({ data: "BILL DELETED SUCCESSFULLY!!!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
