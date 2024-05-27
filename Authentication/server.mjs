import express from "express";
let router = express.Router();

import SignUp from "./SignUp/Signup.mjs";

router.use(SignUp);

export default router;
