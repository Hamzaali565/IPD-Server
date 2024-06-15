import express from "express";
import { IPDBedModel } from "../../../DBRepo/IPD/Masters/IPDBebModel.mjs";
import moment from "moment";

const router = express.Router();

router.post("/ipdbeds", async (req, res) => {
  try {
    const { wardName, bedNumber, user } = req.body;
    if (![wardName, bedNumber, user].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");
    const ipdbed = await IPDBedModel.create({
      wardName,
      bedNumber,
      user,
      createdOn: `${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}`,
    });
    res.status(200).send({ data: ipdbed });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/ipdbeds", async (req, res) => {
  try {
    const { wardName } = req.query;
    if (!wardName) throw new Error("WARD NAME IS REQUIRED!!!");
    const ipdbeds = await IPDBedModel.find({ wardName }, "bedNumber");
    if (ipdbeds.length <= 0) throw new Error("NO DATA FOUNND");
    res.status(200).send({ data: ipdbeds });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/ipdward", async (req, res) => {
  try {
    const response = await IPDBedModel.find({}, "wardName");
    if (response.length <= 0) throw new Error("NO WARDS FOUND!!!");
    const uniqueWardNames = response.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.wardName === item.wardName)
    );
    const nameChange = uniqueWardNames.map((items) => ({
      name: items?.wardName,
      _id: items?._id,
    }));
    nameChange.unshift({ name: "--" });
    res.status(200).send({ data: nameChange });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/ipdadmissionbed", async (req, res) => {
  try {
    const { wardName } = req.query;
    const response = await IPDBedModel.find({ wardName, reserved: false });
    const updatedData = response.map((item) => ({
      name: item.bedNumber,
      _id: item._id,
    }));
    updatedData.unshift({ name: "--" });
    res.status(200).send({ data: updatedData });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
export default router;
