import express from "express";
import { serviceChargesModel } from "../../../DBRepo/IPD/Masters/IPDServiceChargesModel.mjs";
import moment from "moment";
import { serviceNameModel } from "../../../DBRepo/General/Service/ServiceModel.mjs";

const router = express.Router();

router.post("/serviceCharges", async (req, res) => {
  try {
    const {
      parentId,
      parentName,
      wardName,
      party,
      serviceDetails,
      updatedUser,
      _id,
    } = req.body;
    if (
      ![
        parentId,
        parentName,
        wardName,
        party,
        serviceDetails,
        updatedUser,
      ].every(Boolean)
    )
      throw new Error("ALL PARAMETERS ARE REQUIRED");

    if (_id !== "") {
      const updateServiceCharges = await serviceChargesModel.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            parentId,
            parentName,
            wardName,
            party,
            serviceDetails,
            updatedUser,
            updatedOn: `${moment(Date.now()).format("DD:MM:YYYY  HH:mm:ss")}`,
          },
        },
        { new: true }
      );
      res.status(200).send({ data: updateServiceCharges });
      return;
    }
    if (serviceDetails.length <= 0)
      throw new Error("SERVICE DETAILS ARE REQUIRED!!!");
    serviceDetails.map((item, index) => {
      if (![item?.serviceName, item?.charges, item?.status])
        throw new Error(`SOME DATA MISS AT LINE NUMBER ${index + 1}`);
    });
    const response = await serviceChargesModel.create({
      parentId,
      parentName,
      wardName,
      party,
      serviceDetails,
      updatedUser,
      updatedOn: `${moment(Date.now()).format("DD:MM:YYYY  HH:mm:ss")}`,
    });
    res.status(200).send({ data: response });
    return;
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/servicecharges", async (req, res) => {
  try {
    const { party, wardName, parentName } = req.query;
    if (![party, wardName, parentName].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED");
    const serviceName = await serviceNameModel.find(
      { parentName },
      "serviceName"
    );
    const serviceCharges = await serviceChargesModel.find(
      { party, wardName, parentName },
      "serviceDetails"
    );

    if (serviceCharges.length <= 0) {
      const updatedServiceName = serviceName.map((item) => ({
        serviceId: item?._id,
        serviceName: item?.serviceName,
        charges: 0,
        statue: false,
      }));
      res.status(200).send({ data: updatedServiceName });
    }
    const bedId = serviceCharges[0].serviceDetails.map((items) =>
      items?.bedId.toString()
    );
  } catch (error) {}
});

export default router;
