import mongoose from "mongoose";
import express from "express";
import { ConsultantsModel } from "../../../DBRepo/General/ConsultantModel/ConsultantModel.mjs";
import moment from "moment";

const router = express.Router();

router.post("/adddoctor", async (req, res) => {
  try {
    const {
      name,
      speciality,
      pmdc,
      address,
      email,
      cnic,
      phone,
      status,
      updatedUser,
      _id,
    } = req.body;
    if (![name, speciality, cnic, updatedUser].every(Boolean))
      throw new Error("fields like Code, Name, Speciality, Cnic are Mendotary");
    if (_id !== "") {
      const updateConsultant = await ConsultantsModel.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            name,
            speciality,
            pmdc,
            address,
            email,
            cnic,
            phone,
            status,
            updatedUser,
            updatedOn: `${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}`,
          },
        },
        { new: true }
      );
      res.status(200).send({ data1: updateConsultant });
      return;
    }
    const create = await ConsultantsModel.create({
      name,
      speciality,
      pmdc,
      address,
      email,
      cnic,
      phone,
      status,
      updatedUser,
      updatedOn: `${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}`,
    });
    console.log("created", create);
    res.status(200).send({ data: create });
  } catch (error) {
    res.status(400).send({ message: `${error.message}` });
  }
});

router.get("/getconsultant", async (req, res) => {
  try {
    let response = await ConsultantsModel.find(
      { status: true },
      "name speciality status"
    );
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: `${error.message}` });
  }
});

router.get("/vectorconsultant", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) throw new Error("Please Enter Name");
    let response = await ConsultantsModel.find({
      name: { $regex: new RegExp(`${name}`, "i") },
    });
    if (response.length <= 0)
      throw new Error("No Consultant Found with this Name.");
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: `${error.message}` });
  }
});

export default router;
