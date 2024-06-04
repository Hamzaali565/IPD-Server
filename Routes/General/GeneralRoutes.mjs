import express from "express";
let router = express.Router();

import ServiceApi from "../../API/General/ServicesG/Service.mjs";

router.use(ServiceApi);

export default router;
