import express from "express";
import { REAdmissionModel } from "../../../DBRepo/IPD/Discharge/REAdmissionModel.mjs";
import moment from "moment-timezone";

const router = express.Router();

router.post("/readmission", async (req, res) => {
  try {
    const { reAdmission, reAdmitUser, admissionNo, mrNo, reason } = req.body;
    if (
      ![reAdmission, reAdmitUser, reAdmitDate, admissionNo, mrNo].every(Boolean)
    )
      throw new Error("ALL FIELDS ARE REQUIRED!!!");
    const response = await REAdmissionModel.create({
      reAdmission,
      reAdmitUser,
      admissionNo,
      mrNo,
      reason,
      reAdmitDate: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
