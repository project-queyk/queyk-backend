import express from "express";

let resetFlag = false;

const router = express.Router();

router.post("/reset", (req, res) => {
  resetFlag = true;
  res.json({ message: "Reset command sent" });
});

router.get("/reset-status", (req, res) => {
  res.json({ reset: resetFlag });
  resetFlag = false;
});

router.post("/reset-clear", (req, res) => {
  resetFlag = false;
  res.json({ message: "Reset flag cleared" });
});

export default router;
