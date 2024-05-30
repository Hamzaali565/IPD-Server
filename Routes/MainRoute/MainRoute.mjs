import express from "express";
const router = express.Router();

import IPDData from "../IPD/IPDRoutes.mjs";

router.use(IPDData);

export default router;
