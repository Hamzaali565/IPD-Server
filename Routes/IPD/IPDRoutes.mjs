import express from "express";
import IPDWardCharges from "../../API/IPD/Master/IPDWardCharges.mjs";
import IPDBeds from "../../API/IPD/Master/IPDBeds.mjs";
import serviceCharges from "../../API/IPD/Master/IPDServiceCharges.mjs";
import ConsultantCharges from "../../API/IPD/Master/ConsultantCharges.mjs";

const router = express.Router();

router.use(IPDWardCharges);
router.use(IPDBeds);
router.use(serviceCharges);
router.use(ConsultantCharges);

export default router;
