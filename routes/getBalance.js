const express = require("express");
const User = require("../model/user");
const { requireAuth, validateRequest } = require("../middleware");

const router = express.Router();

router.get("/balance", validateRequest, async (req, res) => {
  const balance = await User.find({ user: req.user.balance });
  res.json(balance);
  console.log(balance);
});

module.exports = { balanceGetRouter: router };
