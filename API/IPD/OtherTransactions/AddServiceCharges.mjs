import express from "express";

const router = express.Router();

router.post("/internalservice", async (req, res) => {
  try {
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
