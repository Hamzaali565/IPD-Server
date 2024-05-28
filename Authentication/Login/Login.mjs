import express from "express";
import { hospitalUserModel } from "../../DBRepo/AuthModels/signUpModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET = process.env.SECRET || "topsecret";

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) throw new Error("BOTH PARAMETERS ARE REQUIRED!!");
    const userCheck = await hospitalUserModel.find({ userId });
    if (userCheck.length === 0) throw new Error("USER DOES NOT EXIST!!");
    let match = await bcrypt.compare(password, userCheck[0].password);
    if (!match) throw new Error("YOU HAVE ENTERED WRONG PASSWORD!!");
    let token = jwt.sign(
      {
        _id: userCheck[0]._id,
        userId: userCheck[0].userId,
        iat: Math.floor(Date.now() / 1000) - 30,
      },
      SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: false, // Set to true if your site is HTTPS
    });
    res.status(200).send({
      data: {
        userName: userCheck[0].userName,
        userId: userCheck[0].userId,
        password: userCheck[0].password,
        token,
      },
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
