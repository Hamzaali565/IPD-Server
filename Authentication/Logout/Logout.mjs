import express from "express";

const router = express.Router();

router.post("/api/v1/logout", (req, res) => {
  res.cookie("token", "", {
    maxAge: 1,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.send({ message: "Logout successfull" });
});

export default router;
