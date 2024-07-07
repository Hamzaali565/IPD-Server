import express from "express";
import moment from "moment-timezone";
import { PaymentRefundModal } from "../../../DBRepo/IPD/PaymenModels/PaymentRefundModel.mjs";
import { FinalBillModel } from "../../../DBRepo/IPD/Discharge/FinalBillModel.mjs";
const router = express.Router();

router.post("/paymentrefund", async (req, res) => {
  try {
    const {
      refundType,
      location,
      refundAgainst,
      refundAmount,
      shiftNo,
      againstNo,
      mrNo,
      remarks,
      createdUser,
    } = req.body;
    if (
      ![
        refundType,
        location,
        refundAgainst,
        refundAmount,
        shiftNo,
        againstNo,
        mrNo,
        createdUser,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await PaymentRefundModal.create({
      refundType,
      location,
      refundAgainst,
      refundAmount,
      shiftNo,
      againstNo,
      mrNo,
      remarks,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    if (refundAgainst === "Agaisnt IPD Bill") {
      const updateIPDBill = await FinalBillModel.findOneAndUpdate(
        { billNo: againstNo },
        { $set: { isRefund: true } },
        { new: true }
      );
    }
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
