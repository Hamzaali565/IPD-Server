import express from "express";
const router = express.Router();

import IPDData from "../IPD/IPDRoutes.mjs";
import GeneralData from "../General/GeneralRoutes.mjs";

router.use(GeneralData);
router.use(IPDData);

export default router;
