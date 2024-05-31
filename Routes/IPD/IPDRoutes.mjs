import express from "express";
import IPDWardCharges from "../../API/IPD/Master/IPDWardCharges.mjs";
import IPDBeds from "../../API/IPD/Master/IPDBeds.mjs";

const router = express.Router();

router.use(IPDWardCharges);
router.use(IPDBeds);

export default router;
