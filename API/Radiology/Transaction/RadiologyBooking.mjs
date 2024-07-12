import express from "express";
import { RadiologyBookingModel } from "../../../DBRepo/Radiology/Transaction/RadiologyBookingModel.mjs";
import { PaymentRecieptModel } from "../../../DBRepo/IPD/PaymenModels/PaymentRecieptModel.mjs";
import moment from "moment-timezone";
import { resetCounter } from "../../General/ResetCounter/ResetCounter.mjs";

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
      createdOn: response?.createdOn,
    });
    res.status(200).send({ data: response, data2: payment });
  } catch (error) {
    res.status(400).send({ message: error.message, body: req.body });
  }
});

router.get("/radiologybooking", async (req, res) => {
  try {
    const { mrNo } = req.query;
    if (![mrNo].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await RadiologyBookingModel.find({ mrNo });

    if (response.length <= 0)
      throw new Error("NO SERVICES ADDED TO THIS PATIENT!!!");

    const flatData = response.flatMap((item) => item?.serviceDetails);
    const updatedData = flatData.filter((items) => items?.isDeleted !== true);
    res.status(200).send({ data: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/deleteCollectionRadiology", async (req, res) => {
  try {
    const response = await RadiologyBookingModel.collection.drop();
    resetCounter("radiologyNo");

    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
