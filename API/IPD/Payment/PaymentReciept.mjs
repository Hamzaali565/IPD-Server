import express from "express";
import { PaymentRecieptModel } from "../../../DBRepo/IPD/PaymenModels/PaymentRecieptModel.mjs";
import moment from "moment-timezone";
const router = express.Router();

router.post("/paymentreciept", async (req, res) => {
  try {
    const {
      paymentType,
      location,
      paymentAgainst,
      amount,
      shiftNo,
      againstNo,
      mrNo,
      remarks,
      createdUser,
    } = req.body;
    if (
      ![
        againstNo,
        amount,
        createdUser,
        location,
        mrNo,
        paymentAgainst,
        paymentType,
        shiftNo,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await PaymentRecieptModel.create({
      againstNo,
      amount,
      createdUser,
      location,
      mrNo,
      paymentAgainst,
      paymentType,
      remarks,
      shiftNo,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message, data: req.body });
  }
});

export default router;
