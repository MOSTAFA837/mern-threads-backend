import express from "express";

const router = express.Router();

router.post("/signup", (req, res) => {
  res.send("Sign up");
});

export default router;
