import express from "express";
let router = express.Router();

import ServiceApi from "../../API/General/ServicesG/Service.mjs";
import ConsultantAPI from "../../API/General/Consultant/Consultant.mjs";

router.use(ServiceApi);
router.use(ConsultantAPI);

export default router;
