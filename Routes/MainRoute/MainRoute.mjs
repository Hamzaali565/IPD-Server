import express from "express";
const router = express.Router();

import IPDData from "../IPD/IPDRoutes.mjs";
import GeneralData from "../General/GeneralRoutes.mjs";

router.use(IPDData);
router.use(GeneralData);

export default router;
