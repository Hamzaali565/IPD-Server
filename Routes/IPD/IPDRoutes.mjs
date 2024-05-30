import express from "express";
import IPDWardCharges from "../../API/IPD/Master/IPDWardCharges.mjs";

const router = express.Router();

router.use(IPDWardCharges);

export default router;
