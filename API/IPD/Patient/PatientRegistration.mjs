import express from "express";
import { PatientRegModel } from "../../../DBRepo/IPD/PatientModel/PatientRegModel.mjs";
const router = express.Router();

router.post("/patientreg", async (req, res) => {
  try {
    const {
      MrNo,
      patientType,
      patientName,
      ageYear,
      ageDay,
      ageMonth,
      relativeType,
      gender,
      occupation,
      maritalStatus,
      email,
      cellNo,
      cnicNo,
      address,
      kinName,
      kinRelation,
      kinCell,
      kinCnic,
      kinAddress,
      kinOccupation,
      relativeName,
      updatedUser,
    } = req.body;

    // Array of required parameters
    const requiredParams = [
      "patientType",
      "patientName",
      "ageYear",
      "relativeType",
      "relativeName",
      "gender",
      "maritalStatus",
      "cellNo",
      "updatedUser",
    ];

    // Check for missing parameters
    for (const param of requiredParams) {
      if (!req.body[param]) {
        throw new Error(`${param} is missing`);
      }
    }

    if (MrNo !== "") {
      const checkMR = await PatientRegModel.find({ MrNo });
      console.log("checkMR", checkMR);
      if (checkMR.length > 0) {
        const updateData = await PatientRegModel.findOneAndUpdate(
          { MrNo: MrNo },
          {
            $set: {
              patientType,
              patientName,
              ageYear,
              ageDay,
              ageMonth,
              relativeType,
              gender,
              occupation,
              maritalStatus,
              email,
              cellNo,
              cnicNo,
              address,
              kinName,
              kinRelation,
              kinCell,
              kinCnic,
              kinAddress,
              kinOccupation,
              relativeName,
              updatedUser,
            },
          },
          { new: true }
        );
        res.status(200).send({ data1: updateData });
      }
      return;
    }
    const createData = await PatientRegModel.create({
      patientType,
      patientName,
      ageYear,
      ageDay,
      ageMonth,
      relativeType,
      gender,
      occupation,
      maritalStatus,
      email,
      cellNo,
      cnicNo,
      address,
      kinName,
      kinRelation,
      kinCell,
      kinCnic,
      kinAddress,
      kinOccupation,
      relativeName,
      updatedUser,
    });

    res.status(200).send({ data: createData });
  } catch (error) {
    // Send error response if any parameter is missing or other error occurs
    res.status(400).send({ message: error.message });
  }
});

export default router;
