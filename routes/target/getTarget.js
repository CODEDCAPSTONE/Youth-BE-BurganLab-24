const express = require("express");
const Target = require("../../model/target");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.query.userId;

  const targets = await Target.find({ userId: userId });

  const totalMonthlyDeduction = targets.reduce(
    (sum, target) => sum + target.monthlyDeduction,
    0
  );

  res.json({ targets, totalMonthlyDeduction });
});

module.exports = { targetGetRouter: router };
