import express from "express";
import { RadiologyBookingModel } from "../../../DBRepo/Radiology/Transaction/RadiologyBookingModel.mjs";
import { PaymentRecieptModel } from "../../../DBRepo/IPD/PaymenModels/PaymentRecieptModel.mjs";

const router = express.Router();

router.post("/radiologybooking", async (req, res) => {
  try {
    const {
      mrNo,
      consultant,
      party,
      remarks,
      amount,
      paymentType,
      location,
      serviceDetails,
      createdUser,
      shiftNo,
    } = req.body;
    if (
      ![
        mrNo,
        consultant,
        party,
        amount,
        paymentType,
        location,
        serviceDetails,
        createdUser,
        shiftNo,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");
    const response = await RadiologyBookingModel.create({
      mrNo,
      consultant,
      party,
      remarks,
      amount,
      paymentType,
      location,
      serviceDetails,
      shiftNo,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    const payment = await PaymentRecieptModel.create({
      paymentType,
      location,
      paymentAgainst: "Radiology Bookinhg",
      amount,
      shiftNo,
      againstNo: response?.radiologyNo,
      mrNo,
      remarks,
      createdUser,
      createdOn,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
