const express = require("express");
const Target = require("../../model/target");
const { requireAuth } = require("../../middleware");
const User = require("../../model/user");
const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("targets");
  const targets = user.targets;

  const totalMonthlyDeduction = targets.reduce(
    (sum, target) => sum + target.monthlyDeduction,
    0
  );

  res.json({ targets, totalMonthlyDeduction });
});

module.exports = { targetGetRouter: router };
