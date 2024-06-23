import express from "express";
import IPDWardCharges from "../../API/IPD/Master/IPDWardCharges.mjs";
import IPDBeds from "../../API/IPD/Master/IPDBeds.mjs";
import serviceCharges from "../../API/IPD/Master/IPDServiceCharges.mjs";
import ConsultantCharges from "../../API/IPD/Master/ConsultantCharges.mjs";
import DSCharges from "../../API/IPD/Master/DSCharges.mjs";
import MRReg from "../../API/IPD/Patient/PatientRegistration.mjs";
import Reservation from "../../API/IPD/Patient/Reservation.mjs";
import Shift from "../../API/IPD/Shift/Shift.mjs";
import Admission from "../../API/IPD/Patient/Admission.mjs";
import ConsultantVisit from "../../API/IPD/OtherTransactions/ConsultantVisit.mjs";
import WardCharges from "../../API/IPD/OtherTransactions/WardCharges.mjs";
import ProcedureCharges from "../../API/IPD/OtherTransactions/ProcedureCharges.mjs";

const router = express.Router();

router.use(IPDWardCharges);
router.use(IPDBeds);
router.use(serviceCharges);
router.use(ConsultantCharges);
router.use(DSCharges);
router.use(MRReg);
router.use(Reservation);
router.use(Shift);
router.use(Admission);
router.use(ConsultantVisit);
router.use(WardCharges);
router.use(ProcedureCharges);

export default router;
