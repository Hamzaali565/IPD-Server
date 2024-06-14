import express from "express";
import { ReservationModel } from "../../../DBRepo/IPD/PatientModel/ReservationModel.mjs";
import moment from "moment-timezone";
import { ShiftModel } from "../../../DBRepo/IPD/Shift/ShiftModel.mjs";

const router = express.Router();

router.post("/reservation", async (req, res) => {
  try {
    const {
      mrNo,
      fromDate,
      toDate,
      consultantId,
      shiftNo,
      amount,
      createdUser,
      shiftId,
    } = req.body;
    console.log("Body", req.body);
    if (
      ![
        mrNo,
        fromDate,
        toDate,
        consultantId,
        shiftNo,
        amount,
        createdUser,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");
    const shiftCheck = await ShiftModel.find({ _id: shiftId });
    if (shiftCheck[0].status === false)
      throw new Error(`SHIFT HAS BEEN CLOSED AT ${shiftCheck[0].endedOn}`);
    const response = await ReservationModel.create({
      mrNo,
      fromDate,
      toDate,
      consultantId,
      shiftNo,
      amount,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("DD/MM/YYYY HH:mm:ss"),
    });
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/reservation", async (req, res) => {
  try {
    const { _id, consultantId, updatedUser } = req.body;
    if (!_id) throw new Error("DOCUMENT ID IS REQUIRED!!!");
    if (![consultantId, updatedUser].every(Boolean))
      throw new Error("NO DATA TO BE UPDATED !!!");
    const updateData = await ReservationModel.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          consultantId,
          updatedUser,
          updatedOn: moment(new Date())
            .tz("Asia/Karachi")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
      },
      { new: true }
    );
    res.status(200).send({ data: updateData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
