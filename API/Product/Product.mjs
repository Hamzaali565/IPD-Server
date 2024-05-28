import express from "express";

const router = express.Router();

router.get("/product", async (req, res) => {
  try {
    res.status(200).send({ data: "getting data" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
export default router;
