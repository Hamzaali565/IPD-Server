import express from "express";
import { serviceNameModel } from "../../../DBRepo/General/Service/ServiceModel.mjs";
import moment from "moment";

const router = express.Router();

router.post("/service", async (req, res) => {
  try {
    const { parentName, serviceName, createdUser, _id } = req.body;
    if (![parentName, serviceName, createdUser].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED!!!");
    if (_id !== "") {
      const updateService = await serviceNameModel.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            parentName,
            serviceName,
            createdUser,
            updatedOn: `${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}`,
          },
        },
        { new: true }
      );
      res.status(200).send({ data1: updateService });
      return;
    }
    const response = await serviceNameModel.create({
      parentName,
      serviceName,
      createdUser,
      updatedOn: `${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}`,
    });

    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/service", async (req, res) => {
  try {
    const { parentName } = req.query;
    if (!parentName) throw new Error("PARENT NAME IS REQUIRED!!");
    const response = await serviceNameModel.find({ parentName });
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
export default router;
