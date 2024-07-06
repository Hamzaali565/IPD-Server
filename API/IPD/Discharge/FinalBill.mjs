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
