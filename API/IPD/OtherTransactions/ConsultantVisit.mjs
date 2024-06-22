import express from "express";
import { ConsultantVisitModel } from "../../../DBRepo/IPD/OtherTransactions/RunningBillModels/ConsultantVisitModel.mjs";
import moment from "moment-timezone";
const router = express.Router();

router.post("/consultantvisit", async (req, res) => {
  try {
    const {
      admissionNo,
      mrNo,
      consultantId,
      consultantName,
      visitDate,
      remarks,
      createdUser,
      createdOn,
    } = req.body;

    if (
      ![
        admissionNo,
        mrNo,
        consultantId,
        consultantName,
        visitDate,
        createdUser,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REEQUIRED!!!");
    const response = await ConsultantVisitModel.create({
      admissionNo,
      mrNo,
      consultantId,
      consultantName,
      visitDate,
      remarks,
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

router.put("/consultantvisit", async (req, res) => {
  try {
    const { isDeleted, admissionNo, deletedUser } = req.body;
    if ((!isDeleted, admissionNo, deletedUser))
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");
    const response = await ConsultantVisitModel.findOneAndUpdate(
      { admissionNo },
      {
        $set: {
          isDeleted,
          deletedUser,
          deletedOn: moment(new Date())
            .tz("Asia/Karachi")
            .format("DD/MM/YYYY HH:mm:ss"),
        },
      },
      { new: true }
    );
    res
      .status(200)
      .send({ data: "CONSULTANT DELETED SUCCESSFULLY!!!", datas: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/consultantvisit", async (req, res) => {
  try {
    const { admissionNo } = req.query;
    if (!admissionNo) throw new Error("ADMISSION NO. IS REQUIRED!!!");
    const response = await ConsultantVisitModel.find({ admissionNo });
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
