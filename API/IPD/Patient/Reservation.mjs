import express from "express";
import { ReservationModel } from "../../../DBRepo/IPD/PatientModel/ReservationModel.mjs";
import moment from "moment";

const router = express.Router();

router.post("/reservation", async (req, res) => {
  try {
    const {
      mrNo,
      fromdate,
      toDate,
      consultantId,
      shiftNo,
      amount,
      createdUser,
    } = req.body;
    if (
      ![
        mrNo,
        fromdate,
        toDate,
        consultantId,
        shiftNo,
        amount,
        createdUser,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");
    const response = await ReservationModel.create({
      mrNo,
      fromdate,
      toDate,
      consultantId,
      shiftNo,
      amount,
      createdUser,
      createdOn: moment(new Date())
        .tz("Asia/Karachi")
        .format("YYYY-MM-DD HH:mm:ss"),
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
