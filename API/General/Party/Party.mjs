import express from "express";
import {
  ParentModel,
  PartyModel,
} from "../../../DBRepo/General/PartyModel.mjs/Party.Model.mjs";
import { createdOn } from "../../../src/constants";

const router = express.Router();

router.post("/partyparent", async (req, res) => {
  try {
    const { name, createdUser } = req.body;
    if (!name || !createdUser) throw new Error("PARENT NAME IS REQUIRED !!!");
    const response = await ParentModel.create({
      name: name,
      createdUser,
      createdOn: createdOn,
    });
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/partyname", async (req, res) => {
  try {
    const { name, parent, createdUser } = req.body;
    if (![name, parent, createdUser].every(Boolean))
      throw new Error("ALL PARAMETERS ARE REQUIRED !!!");
    const response = await PartyModel.create({
      name: name,
      parent,
      createdUser,
      createdOn: createdOn,
    });
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
