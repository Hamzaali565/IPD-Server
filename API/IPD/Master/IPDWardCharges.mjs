import express from "express";
import { IPDWardChargesModel } from "../../../DBRepo/IPD/Masters/WardChargesIPDModel.mjs";
import moment from "moment";
import { IPDBedModel } from "../../../DBRepo/IPD/Masters/IPDBebModel.mjs";

const router = express.Router();

router.post("/ipdwardcharges", async (req, res) => {
  try {
    const { party, wardCode, wardName, bedDetails, updateUser, _id } = req.body;
    if (![party, wardCode, wardName, updateUser, bedDetails].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED!!");
    console.log("id length", _id);

    if (_id !== "") {
      const updateIPD = await IPDWardChargesModel.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            party,
            wardCode,
            wardName,
            bedDetails,
            updateUser,
            lastUpdate: `${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}`,
          },
        },
        { new: true }
      );
      console.log("updateIPD", updateIPD);
      if (!updateIPD) {
        throw new Error("ERROR WHILE FINDIND WARD!!");
      } else if (updateIPD) {
        res.status(200).send({ updatedData: updateIPD });
        return;
      }
    }

    if (bedDetails.length <= 0) throw new Error(" BED DETAILS ARE REQUIRED!!");
    bedDetails.map((items, index) => {
      if (![items.bedNumber, items.bedCharges, items.status].every(Boolean))
        throw new Error(`SOME PARAMETERS ARE MISSING AT LINE NO. ${index + 1}`);
    });
    const createBedCharges = await IPDWardChargesModel.create({
      party,
      wardCode,
      wardName,
      bedDetails,
      updateUser,
      lastUpdate: `${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}`,
    });
    res.status(200).send({ data: createBedCharges });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/ipdwardcharges", async (req, res) => {
  try {
    const { party, wardName } = req.query;
    if (!party || !wardName)
      throw new Error("PARTY NAME & WARD NAME IS REQUIRED!!!");
    const ipdWardCharges = await IPDWardChargesModel.find(
      { party, wardName },
      "bedDetails"
    );
    const ipdBed = await IPDBedModel.find({ wardName }, "bedNumber");

    if (ipdWardCharges.length <= 0) {
      res.status(200).send({ data: ipdBed });
    } else {
      // arrange both arrays here
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
