import express from "express";

const router = express.Router();

router.use("", async (req, res, next) => {
  try {
    app.use("/api/v1", (req, res, next) => {
      console.log("req.cookies:", req.cookies);
      if (!req?.cookies?.token)
        throw new Error("include http-only credentials with every request");
      next();
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
